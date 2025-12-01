use ai_stats_sdk_example::Client;

#[tokio::main]
async fn main() {
    let api_key = std::env::var("AI_STATS_API_KEY").expect("Set AI_STATS_API_KEY");
    let client = Client::new(&api_key, "https://api.ai-stats.phaseo.app/v1");
    let resp = client.get_models(None, Some(5), None).await.expect("models");
    println!("models: {:?}", resp.models);
}
