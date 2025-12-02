#include "gen/api/ModelsApi.h"
#include "gen/api/ApiClient.h"
#include "gen/model/ModelListResponse.h"

// Minimal C++ facade for models endpoint.
// Generate with: `pnpm openapi:gen:cpp`

namespace ai_stats_sdk_cpp {

class Client {
public:
    explicit Client(const std::string& apiKey, const std::string& basePath = "https://api.ai-stats.phaseo.app/v1") {
        auto config = std::make_shared<ApiConfiguration>();
        config->setBaseUrl(basePath);
        config->setApiKey("Authorization", "Bearer " + apiKey);
        _apiClient = std::make_shared<ApiClient>(config);
        _modelsApi = std::make_shared<ModelsApi>(_apiClient);
    }

    pplx::task<std::shared_ptr<ModelListResponse>> getModels() {
        return _modelsApi->modelsGet();
    }

private:
    std::shared_ptr<ApiClient> _apiClient;
    std::shared_ptr<ModelsApi> _modelsApi;
};

} // namespace ai_stats_sdk_cpp
