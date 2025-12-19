import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export async function GET() {
	const filePath = path.join(
		process.cwd(),
		"src",
		"data",
		"monitor-history.json"
	);

	try {
		const json = await fs.promises.readFile(filePath, "utf8");
		return new NextResponse(json, {
			headers: { "Content-Type": "application/json" },
		});
	} catch {
		return NextResponse.json([]);
	}
}
