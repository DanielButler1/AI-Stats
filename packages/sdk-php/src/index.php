<?php
// Minimal wrapper around the generated PHP SDK (models only).
// Generate with: `pnpm openapi:gen:php`

namespace AIStats\Sdk;

use AIStats\Sdk\Api\ModelsApi;
use AIStats\Sdk\Configuration;
use AIStats\Sdk\Model\ModelListResponse;

class Client
{
    private ModelsApi $models;

    public function __construct(string $apiKey, string $basePath = 'https://api.ai-stats.phaseo.app/v1')
    {
        $config = Configuration::getDefaultConfiguration()
            ->setHost($basePath)
            ->setApiKey('GatewayAuth', 'Bearer ' . $apiKey);

        $this->models = new ModelsApi(null, $config);
    }

    /**
     * Fetch model catalogue (filters optional).
     */
    public function getModels(array $params = []): ModelListResponse
    {
        return $this->models->modelsGet(
            $params['provider'] ?? null,
            $params['limit'] ?? null,
            $params['offset'] ?? null,
            $params['organisation'] ?? null,
            $params['includeEndpoints'] ?? null,
            $params['excludeEndpoints'] ?? null,
            $params['inputTypes'] ?? null,
            $params['outputTypes'] ?? null,
            $params['includeRumoured'] ?? null,
            $params['includeDeprecated'] ?? null,
            $params['includeRetired'] ?? null
        );
    }
}
