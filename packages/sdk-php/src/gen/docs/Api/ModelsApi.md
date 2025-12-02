# AIStats\\Sdk\ModelsApi

Listings of models and available providers.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**modelsGet()**](ModelsApi.md#modelsGet) | **GET** /models | List all gateway models |


## `modelsGet()`

```php
modelsGet($provider, $limit, $offset, $organisation, $include_endpoints, $exclude_endpoints, $input_types, $output_types, $include_rumoured, $include_deprecated, $include_retired): \AIStats\\Sdk\Model\ModelListResponse
```

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date (falling back to announcement date) in descending order.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ModelsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$provider = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetProviderParameter(); // \AIStats\\Sdk\Model\ModelsGetProviderParameter | Filter results to models served by one or more provider identifiers.
$limit = 56; // int | Maximum number of models to return (default 50).
$offset = 56; // int | Number of models to skip before starting the page.
$organisation = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetOrganisationParameter(); // \AIStats\\Sdk\Model\ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers.
$include_endpoints = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter(); // \AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter | Only return models that support at least one of the specified gateway endpoints.
$exclude_endpoints = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter(); // \AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter | Exclude models that support any of the specified gateway endpoints.
$input_types = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetProviderParameter(); // \AIStats\\Sdk\Model\ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested input content types.
$output_types = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetProviderParameter(); // \AIStats\\Sdk\Model\ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested output content types.
$include_rumoured = true; // bool | Whether to include models marked as rumoured in the response (default true).
$include_deprecated = true; // bool | Whether to include models marked as deprecated in the response (default true).
$include_retired = true; // bool | Whether to include models marked as retired in the response (default true).

try {
    $result = $apiInstance->modelsGet($provider, $limit, $offset, $organisation, $include_endpoints, $exclude_endpoints, $input_types, $output_types, $include_rumoured, $include_deprecated, $include_retired);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ModelsApi->modelsGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **provider** | [**\AIStats\\Sdk\Model\ModelsGetProviderParameter**](../Model/.md)| Filter results to models served by one or more provider identifiers. | [optional] |
| **limit** | **int**| Maximum number of models to return (default 50). | [optional] |
| **offset** | **int**| Number of models to skip before starting the page. | [optional] |
| **organisation** | [**\AIStats\\Sdk\Model\ModelsGetOrganisationParameter**](../Model/.md)| Restrict results to models associated with one or more organisation identifiers. | [optional] |
| **include_endpoints** | [**\AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter**](../Model/.md)| Only return models that support at least one of the specified gateway endpoints. | [optional] |
| **exclude_endpoints** | [**\AIStats\\Sdk\Model\ModelsGetIncludeEndpointsParameter**](../Model/.md)| Exclude models that support any of the specified gateway endpoints. | [optional] |
| **input_types** | [**\AIStats\\Sdk\Model\ModelsGetProviderParameter**](../Model/.md)| Only return models that advertise support for at least one of the requested input content types. | [optional] |
| **output_types** | [**\AIStats\\Sdk\Model\ModelsGetProviderParameter**](../Model/.md)| Only return models that advertise support for at least one of the requested output content types. | [optional] |
| **include_rumoured** | **bool**| Whether to include models marked as rumoured in the response (default true). | [optional] [default to true] |
| **include_deprecated** | **bool**| Whether to include models marked as deprecated in the response (default true). | [optional] [default to true] |
| **include_retired** | **bool**| Whether to include models marked as retired in the response (default true). | [optional] [default to true] |

### Return type

[**\AIStats\\Sdk\Model\ModelListResponse**](../Model/ModelListResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
