# AIStats\\Sdk\AnalyticsApi

Lightweight health checks and analytics (coming soon).

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**analyticsPost()**](AnalyticsApi.md#analyticsPost) | **POST** /analytics | Aggregated usage analytics (coming soon) |
| [**healthzGet()**](AnalyticsApi.md#healthzGet) | **GET** /healthz | Gateway health check |


## `analyticsPost()`

```php
analyticsPost($analytics_post_request): \AIStats\\Sdk\Model\AnalyticsPost200Response
```

Aggregated usage analytics (coming soon)

Accepts an access token and will return aggregated analytics. A placeholder response is returned today while analytics is being built.

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
$analytics_post_request = new \AIStats\\Sdk\Model\AnalyticsPostRequest(); // \AIStats\\Sdk\Model\AnalyticsPostRequest

try {
    $result = $apiInstance->analyticsPost($analytics_post_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AnalyticsApi->analyticsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **analytics_post_request** | [**\AIStats\\Sdk\Model\AnalyticsPostRequest**](../Model/AnalyticsPostRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\AnalyticsPost200Response**](../Model/AnalyticsPost200Response.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `healthzGet()`

```php
healthzGet(): \AIStats\\Sdk\Model\HealthzGet200Response
```

Gateway health check

Returns a simple liveness signal for the gateway.

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

try {
    $result = $apiInstance->healthzGet();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AnalyticsApi->healthzGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\AIStats\\Sdk\Model\HealthzGet200Response**](../Model/HealthzGet200Response.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
