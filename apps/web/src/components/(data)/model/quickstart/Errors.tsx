// src/components/gateway/Errors.tsx
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CodeBlock from "@/components/(data)/model/quickstart/CodeBlock";
import {
	Shield,
	LifeBuoy,
	AlertTriangle,
	Server,
	KeyRound,
	CreditCard,
	Lock,
	Timer,
	Search,
} from "lucide-react";
import * as React from "react";

type ErrorItem = {
	http: string;
	type: string;
	when: string;
	action: string;
	icon: React.ComponentType<{ className?: string }>;
};

function ErrorCard({ http, type, when, action, icon: Icon }: ErrorItem) {
	return (
		<div className="rounded-xl border p-4 hover:bg-muted/40 transition">
			<div className="flex items-center gap-3">
				<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
					<Icon className="h-4 w-4 text-primary" />
				</span>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">{http}</span>
					<Badge
						variant="secondary"
						className="font-mono text-[10px]"
					>
						{type}
					</Badge>
				</div>
			</div>
			<p className="mt-3 text-sm">{when}</p>
			<p className="mt-2 text-xs text-muted-foreground">{action}</p>
		</div>
	);
}

// Keeps inline code compact and on a single line (no odd wrapping)
const InlineCode: React.FC<React.PropsWithChildren> = ({ children }) => (
	<code className="inline whitespace-nowrap rounded bg-muted px-1 py-0.5 font-mono text-[12px]">
		{children}
	</code>
);

export default async function Errors() {
	const clientErrorExample = `HTTP/1.1 402 Payment Required
{
  "error": {
    "type": "payment_error",
    "code": "insufficient_funds",
    "message": "Your wallet balance is too low for this request.",
    "generation_id": "G-abc123"
  }
}`;

	const serverErrorExample = `HTTP/1.1 502 Bad Gateway
{
  "error": {
    "type": "server_error",
    "code": "upstream_provider_error",
    "message": "The model provider returned an error. Please retry.",
    "generation_id": "G-xyz789"
  }
}`;

	const fourXX: ErrorItem[] = [
		{
			http: "400",
			type: "bad_request",
			when: "Malformed JSON, unknown model, or invalid parameters.",
			action: "Validate against schema; check model ID and docs; correct formatting.",
			icon: AlertTriangle,
		},
		{
			http: "401",
			type: "authentication_error",
			when: "Missing/invalid API key, or key lacks required scope.",
			action: "Use the correct key and ensure scopes/permissions include this endpoint.",
			icon: KeyRound,
		},
		{
			http: "402",
			type: "payment_error",
			when: "Insufficient funds/credit for the request.",
			action: "Top up your wallet or reduce request cost (tokens/options).",
			icon: CreditCard,
		},
		{
			http: "403",
			type: "permission_error",
			when: "Key is valid but not allowed to access this resource/model.",
			action: "Update access policy or choose an allowed model/endpoint.",
			icon: Lock,
		},
		{
			http: "404",
			type: "not_found",
			when: "Resource or model ID does not exist.",
			action: "Double-check IDs and the available models list.",
			icon: Search,
		},
		{
			http: "429",
			type: "rate_limit_error",
			when: "Too many requests or token throughput exceeded.",
			action: "Back off with jitter, respect headers, and retry (see guidance below).",
			icon: Timer,
		},
	];

	const fiveXX: ErrorItem[] = [
		{
			http: "500",
			type: "server_error",
			when: "Unexpected error while processing your request.",
			action: "Retry with exponential backoff; contact support if persistent.",
			icon: Server,
		},
		{
			http: "502",
			type: "bad_gateway",
			when: "Upstream model provider returned an error.",
			action: "Retry; if frequent, check our status page or contact support.",
			icon: Server,
		},
		{
			http: "503",
			type: "service_unavailable",
			when: "Temporary overload or maintenance.",
			action: "Retry later with exponential backoff.",
			icon: Server,
		},
		{
			http: "504",
			type: "gateway_timeout",
			when: "Upstream took too long to respond.",
			action: "Retry; consider smaller requests or streaming if applicable.",
			icon: Server,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Errors & rate limits</CardTitle>
				<CardDescription>
					Two simple buckets:{" "}
					<span className="font-medium">
						4xx = your request needs attention
					</span>
					,{" "}
					<span className="font-medium">
						5xx = our service or an upstream provider
					</span>
					. We return descriptive messages to help you resolve issues
					quickly.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Bucket chips */}
				<div className="flex flex-wrap gap-2">
					<Badge variant="secondary">
						4xx — Request needs attention
					</Badge>
					<Badge>5xx — Service or upstream</Badge>
				</div>

				{/* Tabs, not tables */}
				<Tabs defaultValue="4xx" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="4xx">
							4xx · Request needs attention
						</TabsTrigger>
						<TabsTrigger value="5xx">
							5xx · Service or upstream
						</TabsTrigger>
					</TabsList>

					<TabsContent value="4xx" className="mt-4">
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{fourXX.map((e) => (
								<ErrorCard key={e.http} {...e} />
							))}
						</div>
					</TabsContent>

					<TabsContent value="5xx" className="mt-4">
						<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{fiveXX.map((e) => (
								<ErrorCard key={e.http} {...e} />
							))}
						</div>
					</TabsContent>
				</Tabs>

				{/* Examples */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<CodeBlock
						code={clientErrorExample}
						lang="json"
						label="4xx example"
					/>
					<CodeBlock
						code={serverErrorExample}
						lang="json"
						label="5xx example"
					/>
				</div>

				{/* Retry guidance (compact, no odd wrapping) */}
				<Alert className="leading-6">
					<Shield className="h-4 w-4" />
					<AlertTitle>Retry guidance</AlertTitle>
					<AlertDescription className="text-sm">
						<p>
							For <InlineCode>429</InlineCode> and transient{" "}
							<InlineCode>5xx</InlineCode>, use exponential
							backoff with jitter (e.g. randomised
							100-1500&nbsp;ms, doubling on repeats). Include an{" "}
							<InlineCode>Idempotency-Key</InlineCode> header on
							write-like operations to avoid duplicates.
						</p>
					</AlertDescription>
				</Alert>

				{/* Support CTA */}
				<Alert className="leading-6">
					<LifeBuoy className="h-4 w-4" />
					<AlertTitle>Need a hand?</AlertTitle>
					<AlertDescription className="text-sm space-y-3">
						<p>
							If you’re consistently seeing{" "}
							<InlineCode>4xx</InlineCode>, something in the
							request likely needs adjusting. If you’re seeing{" "}
							<InlineCode>5xx</InlineCode>, it may be our services
							or an upstream provider. We always include clear
							messages and a{" "}
							<InlineCode>generation_id</InlineCode> to help you
							diagnose fast.
						</p>

						{/* Callout */}
						<div className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2">
							<div className="flex flex-wrap items-center gap-2">
								<span className="font-medium">
									If you’re stuck, we’re here.
								</span>
								<span className="text-muted-foreground">
									Reach us on your preferred channel below and
									we’ll get you up and running.
								</span>
							</div>
						</div>
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
}
