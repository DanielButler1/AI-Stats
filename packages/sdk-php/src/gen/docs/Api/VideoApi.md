# AIStats\\Sdk\VideoApi

Video generation workflows.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**videoGenerationPost()**](VideoApi.md#videoGenerationPost) | **POST** /video/generation | Generate video |


## `videoGenerationPost()`

```php
videoGenerationPost($video_generation_request): \AIStats\\Sdk\Model\VideoGenerationResponse
```

Generate video

Creates an async video generation job or direct asset depending on the upstream provider. The payload is returned verbatim with gateway metadata attached.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\VideoApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$video_generation_request = new \AIStats\\Sdk\Model\VideoGenerationRequest(); // \AIStats\\Sdk\Model\VideoGenerationRequest

try {
    $result = $apiInstance->videoGenerationPost($video_generation_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling VideoApi->videoGenerationPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **video_generation_request** | [**\AIStats\\Sdk\Model\VideoGenerationRequest**](../Model/VideoGenerationRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\VideoGenerationResponse**](../Model/VideoGenerationResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
