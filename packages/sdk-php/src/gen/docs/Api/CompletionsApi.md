# AIStats\\Sdk\CompletionsApi

Routes that create conversational completions.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**createChatCompletion()**](CompletionsApi.md#createChatCompletion) | **POST** /chat/completions | Create a chat completion |


## `createChatCompletion()`

```php
createChatCompletion($chat_completions_request): \AIStats\\Sdk\Model\ChatCompletionsResponse
```

Create a chat completion

Routes a chat completion request to the healthiest configured provider for the requested model. The gateway normalises upstream responses and adds auditing metadata to the payload.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\CompletionsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$chat_completions_request = new \AIStats\\Sdk\Model\ChatCompletionsRequest(); // \AIStats\\Sdk\Model\ChatCompletionsRequest

try {
    $result = $apiInstance->createChatCompletion($chat_completions_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CompletionsApi->createChatCompletion: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **chat_completions_request** | [**\AIStats\\Sdk\Model\ChatCompletionsRequest**](../Model/ChatCompletionsRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\ChatCompletionsResponse**](../Model/ChatCompletionsResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`, `text/event-stream`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
