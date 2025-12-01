// src/components/gateway/Quickstart.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import CodeBlock from "@/components/(data)/model/gateway/CodeBlock";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { TerminalSquare, ArrowRight, Shield, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "./config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { resolveGatewayPath } from "./endpoint-paths";

interface QuickstartProps {
	modelId?: string;
	aliases?: string[];
	endpoint?: string | null;
}

function buildExamplePayload(endpoint: string | null | undefined, model: string) {
	const normalized = endpoint?.toLowerCase();
	switch (normalized) {
		case "moderations":
			return {
				model,
				input: "Check this prompt for safety before routing downstream.",
			};
		case "embeddings":
			return {
				model,
				input: [
					"Route requests across providers with AI Stats.",
					"Monitor latency, throughput, and spend in real time.",
				],
			};
		case "image.generations":
		case "images.generations":
			return {
				model,
				prompt:
					"Create a cinematic hero image of an AI observability dashboard lit by soft ambient light.",
				size: "1024x1024",
				quality: "high",
			};
		case "video.generations":
			return {
				model,
				prompt:
					"An engineer exploring a real-time operations room, charts updating smoothly, confident tone.",
				duration_seconds: 6,
				aspect_ratio: "16:9",
			};
		case "audio.speech":
			return {
				model,
				voice: "alloy",
				input: "Welcome to the AI Stats Gateway where latency, uptime, and pricing are in your control.",
				format: "mp3",
			};
		default:
			return {
				model,
				messages: [
					{ role: "system", content: "You are a helpful assistant." },
					{
						role: "user",
						content: "Give me one fun fact about cURL.",
					},
				],
			};
	}
}

const escapeForSingleQuotedShell = (json: string) => json.replace(/'/g, "\\'");

const jsonToPythonLiteral = (json: string) =>
	json.replace(/true/g, "True").replace(/false/g, "False").replace(/null/g, "None");

export default function Quickstart({ modelId, aliases, endpoint }: QuickstartProps) {
	const model = safeDecodeURIComponent(modelId) || "model_id_here";
	const endpointPath = resolveGatewayPath(endpoint);
	const endpointUrl = `${BASE_URL}${endpointPath}`;
	const payload = buildExamplePayload(endpoint, model);
	const payloadJson = JSON.stringify(payload, null, 2);
	const payloadJsonCurl = escapeForSingleQuotedShell(payloadJson);
	const payloadJsonNode = payloadJson
		.split("\n")
		.map((line) => `        ${line}`)
		.join("\n");
	const payloadJsonPython = jsonToPythonLiteral(payloadJson);
	const aliasList = Array.from(
		new Set([
			model,
			...(aliases?.map((alias) => safeDecodeURIComponent(alias)) ?? []),
		])
	).filter(Boolean);

	const curlQuickstart = `# 1) Set your key
export AI_STATS_API_KEY="sk-live-***"

# 2) Send a request
curl -s ${endpointUrl} \\
-H "Authorization: Bearer $AI_STATS_API_KEY" \\
-H "Content-Type: application/json" \\
-d '${payloadJsonCurl}'`;

	const nodeQuickstart =
		`// 1) Set your key
const apiKey = process.env.AI_STATS_API_KEY;

// 2) Send a request
const res = await fetch("${endpointUrl}", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Authorization": ` +
		"`Bearer ${apiKey}`" +
		`,
	},
	body: JSON.stringify({
${payloadJsonNode}
	}),
});

const data = await res.json();

console.log(data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2));`;

	const pythonQuickstart = `# Import os and requests libraries
import os
import requests

# Get your API key
API_KEY = os.environ.get("AI_STATS_API_KEY")

# Send a request
url = "${endpointUrl}"
payload = ${payloadJsonPython}

resp = requests.post(url, json=payload, headers={
	"Authorization": f"Bearer {API_KEY}",
	"Content-Type": "application/json",
})

data = resp.json()

print(data.get("choices", [])[0].get("message", {}).get("content") if data.get("choices") else data)`;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<TerminalSquare className="h-5 w-5 text-primary" />
					Quickstart
				</CardTitle>
				<CardDescription>
					Use any of the identifiers below when calling our API.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Alert>
					<Info className="h-4 w-4" />
					<AlertTitle>Model identifiers</AlertTitle>
					<AlertDescription className="text-sm">
						{aliasList.length > 0 ? (
							<span className="flex flex-wrap gap-2">
								{aliasList.map((identifier) => (
									<code
										key={identifier}
										className="rounded bg-muted px-2 py-1 text-xs font-mono select-all cursor-text"
										title={identifier}
									>
										{identifier}
									</code>
								))}
							</span>
						) : (
							"Use the model ID shown above when configuring your requests."
						)}
					</AlertDescription>
				</Alert>

				<div className="space-y-3">
					<h3 className="text-base font-semibold">
						1) Get an API key
					</h3>
					<p className="text-sm text-muted-foreground">
						Create a key in
						<Link
							href="/settings/keys"
							className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm font-medium text-primary hover:bg-primary/5"
						>
							<span>Dashboard</span>
							<ArrowRight className="h-4 w-4" />
							<span>API Keys</span>
						</Link>
						, then set it as{" "}
						<code className="bg-gray-400/20 p-1 rounded-md">
							AI_STATS_API_KEY
						</code>{" "}
						in your environment variables.
					</p>

					<Alert variant="destructive">
						<Shield className="h-4 w-4" />
						<AlertTitle>Keep your API key secret</AlertTitle>
						<AlertDescription className="text-sm">
							This key grants access to all models and your
							credits. Treat it like a password, do not share it,
							commit it to source control, or expose it in
							client-side code. Rotate keys immediately if you
							suspect compromise.
						</AlertDescription>
					</Alert>
				</div>

				<Separator />

				<Tabs defaultValue="curl" className="w-full">
					<TabsList>
						<TabsTrigger value="curl">cURL</TabsTrigger>
						<TabsTrigger value="node">TypeScript</TabsTrigger>
						<TabsTrigger value="python">Python</TabsTrigger>
					</TabsList>
					<TabsContent value="curl" className="mt-4">
						<CodeBlock
							code={curlQuickstart}
							lang="bash"
							label="bash"
						/>
					</TabsContent>
					<TabsContent value="node" className="mt-4">
						<CodeBlock code={nodeQuickstart} lang="ts" label="ts" />
					</TabsContent>
					<TabsContent value="python" className="mt-4">
						<CodeBlock
							code={pythonQuickstart}
							lang="python"
							label="python"
						/>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
