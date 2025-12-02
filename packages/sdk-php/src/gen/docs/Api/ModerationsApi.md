# AIStats\\Sdk\ModerationsApi

Content moderation scoring.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**moderationsPost()**](ModerationsApi.md#moderationsPost) | **POST** /moderations | Score content with moderation models |


## `moderationsPost()`

```php
moderationsPost($moderation_request): \AIStats\\Sdk\Model\ModerationResponse
```

Score content with moderation models

Evaluates text input against provider moderation policies and returns the gateway-normalised safety scores.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ModerationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$moderation_request = new \AIStats\\Sdk\Model\ModerationRequest(); // \AIStats\\Sdk\Model\ModerationRequest

try {
    $result = $apiInstance->moderationsPost($moderation_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ModerationsApi->moderationsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **moderation_request** | [**\AIStats\\Sdk\Model\ModerationRequest**](../Model/ModerationRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\ModerationResponse**](../Model/ModerationResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
