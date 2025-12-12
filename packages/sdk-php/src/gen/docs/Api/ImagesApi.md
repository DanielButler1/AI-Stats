# AIStats\\Sdk\ImagesApi

Image generation workflows.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**imagesEditsPost()**](ImagesApi.md#imagesEditsPost) | **POST** /images/edits | Edit an image |
| [**imagesGenerationsPost()**](ImagesApi.md#imagesGenerationsPost) | **POST** /images/generations | Generate images |


## `imagesEditsPost()`

```php
imagesEditsPost($images_edit_request): \AIStats\\Sdk\Model\ImageGenerationResponse
```

Edit an image

Applies edits to an existing image using the specified model and prompt.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ImagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$images_edit_request = new \AIStats\\Sdk\Model\ImagesEditRequest(); // \AIStats\\Sdk\Model\ImagesEditRequest

try {
    $result = $apiInstance->imagesEditsPost($images_edit_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ImagesApi->imagesEditsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **images_edit_request** | [**\AIStats\\Sdk\Model\ImagesEditRequest**](../Model/ImagesEditRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\ImageGenerationResponse**](../Model/ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `imagesGenerationsPost()`

```php
imagesGenerationsPost($image_generation_request): \AIStats\\Sdk\Model\ImageGenerationResponse
```

Generate images

Creates one or more images from a text prompt using the configured provider for the requested model.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ImagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$image_generation_request = new \AIStats\\Sdk\Model\ImageGenerationRequest(); // \AIStats\\Sdk\Model\ImageGenerationRequest

try {
    $result = $apiInstance->imagesGenerationsPost($image_generation_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ImagesApi->imagesGenerationsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **image_generation_request** | [**\AIStats\\Sdk\Model\ImageGenerationRequest**](../Model/ImageGenerationRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\ImageGenerationResponse**](../Model/ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
