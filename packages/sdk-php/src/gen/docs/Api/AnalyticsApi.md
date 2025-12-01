# AIStats\\Sdk\AnalyticsApi

Telemetry, health, and performance insights.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**healthGet()**](AnalyticsApi.md#healthGet) | **GET** /health | Inspect provider health |


## `healthGet()`

```php
healthGet($provider, $model, $endpoint): \AIStats\\Sdk\Model\GatewayHealthResponse
```

Inspect provider health

Returns the most recent latency, success rate, and breaker status for each configured provider.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\AnalyticsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$provider = 'provider_example'; // string | Filter to a specific provider name.
$model = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelId(); // \AIStats\\Sdk\Model\ModelId | Optional model id used to resolve candidate providers.
$endpoint = 'endpoint_example'; // string | Endpoint identifier paired with `model` when deriving providers.

try {
    $result = $apiInstance->healthGet($provider, $model, $endpoint);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AnalyticsApi->healthGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **provider** | **string**| Filter to a specific provider name. | [optional] |
| **model** | [**\AIStats\\Sdk\Model\ModelId**](../Model/.md)| Optional model id used to resolve candidate providers. | [optional] |
| **endpoint** | **string**| Endpoint identifier paired with &#x60;model&#x60; when deriving providers. | [optional] |

### Return type

[**\AIStats\\Sdk\Model\GatewayHealthResponse**](../Model/GatewayHealthResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
