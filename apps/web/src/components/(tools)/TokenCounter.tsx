"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { encoding_for_model } from "@dqbd/tiktoken";

export default function TokenCounter() {
	const [text, setText] = useState(
		"Hello, how are you today? I'm doing well, thank you for asking."
	);
	const [debouncedText, setDebouncedText] = useState(text);

	// Debounce text input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedText(text);
		}, 300);
		return () => clearTimeout(timer);
	}, [text]);

	const {
		tokenCount,
		tokens,
		decodedTokens,
		normalizedText,
		tokenBoundaries,
	} = useMemo(() => {
		try {
			const encoding = encoding_for_model("gpt-5");
			const tokenIds = encoding.encode(debouncedText);
			const decoded: string[] = [];
			for (const id of tokenIds) {
				const bytes = encoding.decode_single_token_bytes(id);
				decoded.push(new TextDecoder().decode(bytes));
			}
			const normalized = new TextDecoder().decode(
				encoding.decode(tokenIds)
			);
			const boundaries: number[] = [0];
			for (let i = 1; i <= tokenIds.length; i++) {
				const prefix = encoding.decode(tokenIds.slice(0, i));
				boundaries.push(prefix.length);
			}
			encoding.free();
			return {
				tokenCount: tokenIds.length,
				tokens: tokenIds,
				decodedTokens: decoded,
				normalizedText: normalized,
				tokenBoundaries: boundaries,
			};
		} catch (error) {
			console.error("Error counting tokens:", error);
			return {
				tokenCount: 0,
				tokens: new Uint32Array(),
				decodedTokens: [] as string[],
				normalizedText: "",
				tokenBoundaries: [] as number[],
			};
		}
	}, [debouncedText]);

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Token Counter</h1>
				<p className="text-muted-foreground">
					Estimate token usage for text with various AI models using
					tiktoken. See how your text is broken down into tokens.
				</p>
				<Alert className="mt-4">
					<InfoIcon />
					<AlertTitle>Note</AlertTitle>
					<AlertDescription>
						Token counts are estimates and may vary slightly
						depending on the exact model and provider combination.
						We recommend putting no more than 2048 tokens for
						stability.
					</AlertDescription>
				</Alert>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>Text Input</span>
							<span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">
								{debouncedText.length} chars
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							value={text}
							onChange={(e) => setText(e.target.value)}
							className="min-h-[300px] font-mono resize-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
							placeholder="Enter your text here..."
						/>
					</CardContent>
				</Card>

				<Card className="shadow-sm">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Token Analysis</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="text-center p-6 bg-linear-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
								<div className="text-6xl font-bold text-primary mb-2">
									{tokenCount}
								</div>
								<div className="text-lg text-muted-foreground font-medium">
									tokens
								</div>
								<div className="mt-3 text-xs text-muted-foreground">
									Estimated token count
								</div>
							</div>
							<div>
								<h4 className="text-sm font-semibold mb-3 text-foreground">
									Individual Tokens
								</h4>
								<div className="max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
									<div className="flex flex-wrap gap-2">
										{decodedTokens.map((token, index) => {
											const colors = [
												"bg-blue-100 text-blue-800 border-blue-200",
												"bg-green-100 text-green-800 border-green-200",
												"bg-purple-100 text-purple-800 border-purple-200",
												"bg-orange-100 text-orange-800 border-orange-200",
												"bg-pink-100 text-pink-800 border-pink-200",
												"bg-indigo-100 text-indigo-800 border-indigo-200",
											];
											const colorClass =
												colors[index % colors.length];
											return (
												<Badge
													key={index}
													variant="outline"
													className={`font-mono text-xs transition-all duration-200 hover:scale-105 hover:shadow-sm ${colorClass} border`}
												>
													{token || "—"}
												</Badge>
											);
										})}
									</div>
								</div>
								<div className="mt-3 text-sm text-muted-foreground">
									Each badge represents one token
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
