require_relative 'gen/api/models_api'
require_relative 'gen/api_client'
require_relative 'gen/configuration'

module AIStatsSdk
  # Minimal wrapper exposing the models endpoint.
  # Generate with: `pnpm openapi:gen:ruby`
  class Client
    def initialize(api_key:, base_path: 'https://api.ai-stats.phaseo.app/v1')
      config = AIStatsSdk::Configuration.default
      config.base_path = base_path
      config.access_token = api_key
      @models_api = AIStatsSdk::ModelsApi.new(AIStatsSdk::ApiClient.new(config))
    end

    def get_models(options = {})
      @models_api.models_get(options)
    end
  end
end
