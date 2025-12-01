// Minimal wrapper around the generated Rust SDK (models only).
// Generate with: `pnpm openapi:gen:rust`

use ai_stats_sdk::apis::configuration::Configuration;
use ai_stats_sdk::apis::models_api;
use ai_stats_sdk::models::ModelListResponse;

pub struct Client {
    config: Configuration,
}

impl Client {
    pub fn new(api_key: &str, base_path: &str) -> Self {
        let mut cfg = Configuration::new();
        cfg.base_path = base_path.to_string();
        cfg.bearer_access_token = Some(api_key.to_string());
        Client { config: cfg }
    }

    pub async fn get_models(
        &self,
        provider: Option<String>,
        limit: Option<i32>,
        offset: Option<i32>,
    ) -> Result<ModelListResponse, models_api::Error> {
        models_api::models_get(
            &self.config,
            provider,
            limit,
            offset,
            None,
            None,
            None,
            None,
            None,
            None,
            None,
        )
        .await
    }
}
