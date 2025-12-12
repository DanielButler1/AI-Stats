# AIStats\\Sdk\ResponsesApi



All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createResponse()**](ResponsesApi.md#createResponse) | **POST** /responses | Create a Response |


## `createResponse()`

```php
createResponse($responses_request): \AIStats\\Sdk\Model\ResponsesResponse
```

Create a Response

Creates a model response

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ResponsesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$responses_request = new \AIStats\\Sdk\Model\ResponsesRequest(); // \AIStats\\Sdk\Model\ResponsesRequest

try {
    $result = $apiInstance->createResponse($responses_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ResponsesApi->createResponse: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **responses_request** | [**\AIStats\\Sdk\Model\ResponsesRequest**](../Model/ResponsesRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\ResponsesResponse**](../Model/ResponsesResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `text/event-stream`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
