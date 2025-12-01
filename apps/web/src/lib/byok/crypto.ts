// src/lib/byok/crypto.ts
import { randomBytes, createCipheriv, createDecipheriv, createHash } from "crypto";

type Encrypted = {
    ciphertextB64: string;
    ivB64: string;
    tagB64: string;
    keyVersion: number;
    fingerprintHex: string;
    prefix: string;
    suffix: string;
};

function getKey(version: number): Buffer {
    const active = Number(process.env.BYOK_ACTIVE_KEY_VERSION || "1");
    const v = version ?? active;
    const envVar = v === 1 ? process.env.BYOK_KMS_KEY_V1 : undefined;
    if (!envVar) throw new Error(`Missing BYOK_KMS_KEY_V${v}`);
    const b64 = envVar.startsWith("base64:") ? envVar.slice(7) : envVar;
    const key = Buffer.from(b64, "base64");
    if (key.length !== 32) throw new Error("BYOK key must be 32 bytes (AES-256)");
    return key;
}

export function sha256Hex(s: string): string {
    return createHash("sha256").update(s, "utf8").digest("hex");
}

export function encryptSecret(plaintext: string, keyVersion = Number(process.env.BYOK_ACTIVE_KEY_VERSION || "1")): Encrypted {
    if (!plaintext) throw new Error("Missing secret");
    const key = getKey(keyVersion);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    const prefix = plaintext.slice(0, 6);
    const suffix = plaintext.slice(-4);

    return {
        ciphertextB64: ct.toString("base64"),
        ivB64: iv.toString("base64"),
        tagB64: tag.toString("base64"),
        keyVersion,
        fingerprintHex: sha256Hex(plaintext),
        prefix,
        suffix,
    };
}

export function decryptSecret(row: {
    enc_value: Uint8Array | Buffer;
    enc_iv: Uint8Array | Buffer;
    enc_tag: Uint8Array | Buffer;
    key_version: number;
}): string {
    const key = getKey(row.key_version);
    const iv = Buffer.from(row.enc_iv);
    const tag = Buffer.from(row.enc_tag);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(Buffer.from(row.enc_value)), decipher.final()]);
    return pt.toString("utf8");
}
