using System.Net.Http.Headers;
using AiStatsSdk.Client;
using AiStatsSdk.Api;
using AiStatsSdk.Model;

// Simple wrapper exposing only the Models endpoint for now.
// Generate the SDK with: `pnpm openapi:gen:csharp`

namespace AiStatsSdk
{
    public class Client
    {
        private readonly ModelsApi _modelsApi;

        public Client(string apiKey, string basePath = "https://api.ai-stats.phaseo.app/v1")
        {
            var config = new Configuration { BasePath = basePath };
            config.DefaultHeaders["Authorization"] = $"Bearer {apiKey}";
            _modelsApi = new ModelsApi(new HttpClient { BaseAddress = new Uri(basePath) }, config);
        }

        public ModelListResponse GetModels(
            string? provider = null,
            int? limit = null,
            int? offset = null,
            string? organisation = null)
        {
            return _modelsApi.ModelsGet(provider, limit, offset, organisation);
        }
    }
}
