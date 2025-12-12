// src/components/gateway/Quickstart.tsx
"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import CodeBlock from "@/components/(data)/model/quickstart/CodeBlock";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { TerminalSquare, ArrowRight, Shield, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BASE_URL } from "./config";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";
import { resolveGatewayPath } from "./endpoint-paths";
import { useState } from "react";

interface QuickstartProps {
	modelId?: string;
	aliases?: string[];
	endpoint?: string | null;
	supportedEndpoints?: string[];
}

function buildExamplePayload(
	endpoint: string | null | undefined,
	model: string
) {
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
				prompt: "Create a cinematic hero image of an AI observability dashboard lit by soft ambient light.",
				size: "1024x1024",
				quality: "high",
			};
		case "video.generations":
			return {
				model,
				prompt: "An engineer exploring a real-time operations room, charts updating smoothly, confident tone.",
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
	json
		.replace(/true/g, "True")
		.replace(/false/g, "False")
		.replace(/null/g, "None");

const ENDPOINT_OPTIONS = [
	{ value: "responses", label: "Responses" },
	{ value: "chat.completions", label: "Chat Completions" },
	{ value: "embeddings", label: "Embeddings" },
	{ value: "moderations", label: "Moderations" },
	{ value: "images.generations", label: "Image Generation" },
	{ value: "video.generations", label: "Video Generation" },
	{ value: "audio.speech", label: "Audio Speech" },
	{ value: "audio.transcriptions", label: "Audio Transcription" },
	{ value: "audio.translations", label: "Audio Translation" },
];

const LANGUAGE_OPTIONS = [
	{ value: "curl", label: "cURL", disabled: false },
	{ value: "node-fetch", label: "Node.js fetch", disabled: false },
	{ value: "python-requests", label: "Python requests", disabled: false },
	{ value: "typescript-sdk", label: "TypeScript SDK", disabled: false },
	{ value: "python-sdk", label: "Python SDK", disabled: false },
	{ value: "go-sdk", label: "Go SDK (Coming Soon)", disabled: true },
	{ value: "csharp-sdk", label: "C# SDK (Coming Soon)", disabled: true },
	{ value: "php-sdk", label: "PHP SDK (Coming Soon)", disabled: true },
	{ value: "ruby-sdk", label: "Ruby SDK (Coming Soon)", disabled: true },
	{ value: "rust-sdk", label: "Rust SDK (Coming Soon)", disabled: true },
	{ value: "cpp-sdk", label: "C++ SDK (Coming Soon)", disabled: true },
	{ value: "openai-python", label: "OpenAI Python Client", disabled: false },
	{ value: "openai-node", label: "OpenAI Node.js Client", disabled: false },
];

export default function Quickstart({
	modelId,
	aliases,
	endpoint,
	supportedEndpoints = [],
}: QuickstartProps) {
	// Filter endpoints to only supported ones
	const availableEndpoints = ENDPOINT_OPTIONS.filter(
		(option) =>
			supportedEndpoints.includes(option.value) ||
			(option.value === "responses" &&
				supportedEndpoints.includes("chat.completions")) // responses is alias for chat.completions
	);

	// Default to responses if available, then chat.completions, then first available
	const defaultEndpoint =
		availableEndpoints.find((e) => e.value === "responses")?.value ||
		availableEndpoints.find((e) => e.value === "chat.completions")?.value ||
		availableEndpoints[0]?.value ||
		"chat.completions";

	const [selectedEndpoint, setSelectedEndpoint] = useState(defaultEndpoint);
	const [selectedLanguage, setSelectedLanguage] = useState("curl");

	const model = safeDecodeURIComponent(modelId) || "model_id_here";
	const endpointPath = resolveGatewayPath(selectedEndpoint);
	const endpointUrl = `${BASE_URL}${endpointPath}`;
	const payload = buildExamplePayload(selectedEndpoint, model);
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

	function getInstallationCode(language: string): string {
		switch (language) {
			case "typescript-sdk":
				return "npm install @ai-stats/sdk";
			case "python-sdk":
				return "pip install ai-stats";
			case "go-sdk":
				return "go get github.com/ai-stats/go-sdk";
			case "csharp-sdk":
				return "dotnet add package AIStats";
			case "php-sdk":
				return "composer require ai-stats/sdk";
			case "ruby-sdk":
				return "gem install ai_stats";
			case "rust-sdk":
				return '# Add to Cargo.toml\n# ai-stats = "0.1"';
			case "cpp-sdk":
				return "# Add to CMakeLists.txt\n# find_package(ai-stats REQUIRED)";
			case "openai-python":
				return "pip install openai";
			case "openai-node":
				return "npm install openai";
			default:
				return "";
		}
	}

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

	const typescriptSdkUsage = `import { AIStats } from '@ai-stats/sdk';

const client = new AIStats({
  apiKey: process.env.AI_STATS_API_KEY,
});

const response = await client.chat.completions.create({
  model: "${model}",
  messages: [
    { role: "user", content: "Hello, world!" }
  ],
});

console.log(response.choices[0].message.content);`;

	const pythonSdkUsage = `from ai_stats import AIStats

client = AIStats(api_key=os.environ.get("AI_STATS_API_KEY"))

response = client.chat.completions.create(
    model="${model}",
    messages=[
        {"role": "user", "content": "Hello, world!"}
    ]
)

print(response.choices[0].message.content)`;

	const goSdkUsage = `package main

import (
    "context"
    "fmt"
    "os"
    "github.com/ai-stats/go-sdk"
)

func main() {
    client := aistats.NewClient(os.Getenv("AI_STATS_API_KEY"))
    
    response, err := client.Chat.Completions(context.Background(), aistats.ChatCompletionRequest{
        Model: "${model}",
        Messages: []aistats.ChatMessage{
            {Role: "user", Content: "Hello, world!"},
        },
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println(response.Choices[0].Message.Content)
}`;

	const csharpSdkUsage = `using AIStats;

var client = new AIStatsClient(Environment.GetEnvironmentVariable("AI_STATS_API_KEY"));

var response = await client.Chat.Completions.CreateAsync(new ChatCompletionRequest
{
    Model = "${model}",
    Messages = new[]
    {
        new ChatMessage { Role = "user", Content = "Hello, world!" }
    }
});

Console.WriteLine(response.Choices[0].Message.Content);`;

	const phpSdkUsage = `<?php
require 'vendor/autoload.php';

use AIStats\\AIStats;

$client = new AIStats(getenv('AI_STATS_API_KEY'));

$response = $client->chat()->completions()->create([
    'model' => '${model}',
    'messages' => [
        ['role' => 'user', 'content' => 'Hello, world!']
    ]
]);

echo $response->choices[0]->message->content;
?>`;

	const rubySdkUsage = `require 'ai_stats'

client = AIStats::Client.new(ENV['AI_STATS_API_KEY'])

response = client.chat.completions.create(
  model: '${model}',
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ]
)

puts response.choices[0].message.content`;

	const rustSdkUsage = `use ai_stats::Client;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new(std::env::var("AI_STATS_API_KEY")?);
    
    let response = client.chat().completions().create(ChatCompletionRequest {
        model: "${model}".to_string(),
        messages: vec![
            ChatMessage {
                role: "user".to_string(),
                content: "Hello, world!".to_string(),
            }
        ],
    }).await?;
    
    println!("{}", response.choices[0].message.content);
    Ok(())
}`;

	const cppSdkUsage = `#include <ai_stats/client.hpp>

int main() {
    auto client = ai_stats::Client(std::getenv("AI_STATS_API_KEY"));
    
    auto response = client.chat().completions().create({
        {"model", "${model}"},
        {"messages", {
            {{"role", "user"}, {"content", "Hello, world!"}}
        }}
    });
    
    std::cout << response["choices"][0]["message"]["content"] << std::endl;
    return 0;
}`;

	const nodeFetchQuickstart = `// 1) Set your key
const apiKey = process.env.AI_STATS_API_KEY;

// 2) Send a request
const res = await fetch("${endpointUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${apiKey}\`,
  },
  body: JSON.stringify({
${payloadJsonNode}
  }),
});

const data = await res.json();

console.log(data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2));`;

	const pythonRequestsQuickstart = `# Import os and requests libraries
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

	const openaiPythonUsage = `from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("AI_STATS_API_KEY"),
    base_url="${BASE_URL}",
)

response = client.chat.completions.create(
    model="${model}",
    messages=[
        {"role": "user", "content": "Hello, world!"}
    ]
)

print(response.choices[0].message.content)`;

	const openaiNodeUsage = `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AI_STATS_API_KEY,
  baseURL: '${BASE_URL}',
});

const response = await client.chat.completions.create({
  model: '${model}',
  messages: [
    { role: 'user', content: 'Hello, world!' }
  ],
});

console.log(response.choices[0].message.content);`;

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

				<div className="space-y-3">
					<h3 className="text-base font-semibold">
						2) Choose your endpoint and language
					</h3>
					<div className="flex gap-4">
						<div className="flex-1">
							<label className="text-sm font-medium">
								Endpoint
							</label>
							<Select
								value={selectedEndpoint}
								onValueChange={setSelectedEndpoint}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{availableEndpoints.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1">
							<label className="text-sm font-medium">
								Language
							</label>
							<Select
								value={selectedLanguage}
								onValueChange={setSelectedLanguage}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LANGUAGE_OPTIONS.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											disabled={option.disabled}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-3">
					<h3 className="text-base font-semibold">
						3) Send your request
					</h3>
					{/* Installation step for SDKs */}
					{(selectedLanguage.includes("sdk") ||
						selectedLanguage.includes("openai")) && (
						<div className="space-y-2">
							<h4 className="text-sm font-medium">
								Installation
							</h4>
							<CodeBlock
								code={getInstallationCode(selectedLanguage)}
								lang="bash"
								label="bash"
							/>
						</div>
					)}
					{/* Usage code */}
					<div className="space-y-2">
						<h4 className="text-sm font-medium">
							{selectedLanguage.includes("sdk") ||
							selectedLanguage.includes("openai")
								? "Usage"
								: "Code"}
						</h4>
						{selectedLanguage === "curl" && (
							<CodeBlock
								code={curlQuickstart}
								lang="bash"
								label="bash"
							/>
						)}
						{selectedLanguage === "typescript-sdk" && (
							<CodeBlock
								code={typescriptSdkUsage}
								lang="ts"
								label="ts"
							/>
						)}
						{selectedLanguage === "python-sdk" && (
							<CodeBlock
								code={pythonSdkUsage}
								lang="python"
								label="python"
							/>
						)}
						{selectedLanguage === "go-sdk" && (
							<CodeBlock code={goSdkUsage} lang="go" label="go" />
						)}
						{selectedLanguage === "csharp-sdk" && (
							<CodeBlock
								code={csharpSdkUsage}
								lang="csharp"
								label="csharp"
							/>
						)}
						{selectedLanguage === "php-sdk" && (
							<CodeBlock
								code={phpSdkUsage}
								lang="php"
								label="php"
							/>
						)}
						{selectedLanguage === "ruby-sdk" && (
							<CodeBlock
								code={rubySdkUsage}
								lang="ruby"
								label="ruby"
							/>
						)}
						{selectedLanguage === "rust-sdk" && (
							<CodeBlock
								code={rustSdkUsage}
								lang="rust"
								label="rust"
							/>
						)}
						{selectedLanguage === "cpp-sdk" && (
							<CodeBlock
								code={cppSdkUsage}
								lang="cpp"
								label="cpp"
							/>
						)}
						{selectedLanguage === "node-fetch" && (
							<CodeBlock
								code={nodeFetchQuickstart}
								lang="ts"
								label="ts"
							/>
						)}
						{selectedLanguage === "python-requests" && (
							<CodeBlock
								code={pythonRequestsQuickstart}
								lang="python"
								label="python"
							/>
						)}
						{selectedLanguage === "openai-python" && (
							<CodeBlock
								code={openaiPythonUsage}
								lang="python"
								label="python"
							/>
						)}
						{selectedLanguage === "openai-node" && (
							<CodeBlock
								code={openaiNodeUsage}
								lang="ts"
								label="ts"
							/>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
