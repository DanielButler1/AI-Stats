import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ModelInfoCardProps {
	model: any;
}

export default function ModelInfoCard({ model }: ModelInfoCardProps) {
	const showAnnounced =
		model.announced_date && model.announced_date !== model.release_date;

	return (
		<Card className="shadow-lg mb-4">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					Model Information
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Release Details Card */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold">
								Release Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{showAnnounced && (
								<div>
									<p className="text-sm text-muted-foreground">
										Announced
									</p>
									<p className="font-semibold">
										{model.announced_date
											? new Date(
													model.announced_date
											  ).toLocaleDateString("en-GB", {
													day: "2-digit",
													month: "short",
													year: "numeric",
											  })
											: "-"}
									</p>
								</div>
							)}
							<div>
								<p className="text-sm text-muted-foreground">
									Released
								</p>
								<p className="font-semibold">
									{model.release_date
										? new Date(
												model.release_date
										  ).toLocaleDateString("en-GB", {
												day: "2-digit",
												month: "short",
												year: "numeric",
										  })
										: "-"}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Knowledge Cutoff
								</p>
								<p className="font-semibold">
									{model.knowledge_cutoff
										? (() => {
												const date = new Date(
													model.knowledge_cutoff
												);
												if (!isNaN(date.getTime())) {
													return date.toLocaleDateString(
														"en-GB",
														{
															month: "short",
															year: "numeric",
														}
													);
												}
												return model.knowledge_cutoff;
										  })()
										: "-"}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									License
								</p>
								<p className="font-semibold">
									{model.license || "-"}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Model Architecture Card */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold">
								Model Architecture
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<p className="text-sm text-muted-foreground">
									Parameters
								</p>
								<p className="font-semibold">
									{model.parameters
										? model.parameters.toLocaleString()
										: "-"}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Training Data
								</p>
								<p className="font-semibold">
									{model.training_data || "-"}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Context Window Card */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="text-xl font-bold">
								Context Window
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<p className="text-sm text-muted-foreground">
									Input Context Length
								</p>
								<p className="font-semibold">
									{model.input_context_length
										? model.input_context_length.toLocaleString()
										: "-"}{" "}
									tokens
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									Output Context Length
								</p>
								<p className="font-semibold">
									{model.output_context_length
										? model.output_context_length.toLocaleString()
										: "-"}{" "}
									tokens
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>
	);
}
