# AIStats\\Sdk\BatchApi

Batch job creation and retrieval.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**batchesBatchIdGet()**](BatchApi.md#batchesBatchIdGet) | **GET** /batches/{batch_id} | Retrieve a batch job |
| [**batchesPost()**](BatchApi.md#batchesPost) | **POST** /batches | Create a batch job |


## `batchesBatchIdGet()`

```php
batchesBatchIdGet($batch_id): \AIStats\\Sdk\Model\BatchResponse
```

Retrieve a batch job

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\BatchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$batch_id = 'batch_id_example'; // string

try {
    $result = $apiInstance->batchesBatchIdGet($batch_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling BatchApi->batchesBatchIdGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **batch_id** | **string**|  | |

### Return type

[**\AIStats\\Sdk\Model\BatchResponse**](../Model/BatchResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `batchesPost()`

```php
batchesPost($batch_request): \AIStats\\Sdk\Model\BatchResponse
```

Create a batch job

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\BatchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$batch_request = new \AIStats\\Sdk\Model\BatchRequest(); // \AIStats\\Sdk\Model\BatchRequest

try {
    $result = $apiInstance->batchesPost($batch_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling BatchApi->batchesPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **batch_request** | [**\AIStats\\Sdk\Model\BatchRequest**](../Model/BatchRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\BatchResponse**](../Model/BatchResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
