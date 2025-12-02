export class RandomSource {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed >>> 0;
    }

    next(): number {
        // Mulberry32 style PRNG for deterministic randomness
        let t = (this.seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    int(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

export function shuffleInPlace<T>(items: T[], random: RandomSource): void {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(random.next() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
}