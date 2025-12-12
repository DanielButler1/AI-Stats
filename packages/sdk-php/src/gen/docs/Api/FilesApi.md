# AIStats\\Sdk\FilesApi

File upload and retrieval for batch workflows.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**filesFileIdGet()**](FilesApi.md#filesFileIdGet) | **GET** /files/{file_id} | Retrieve a file |
| [**filesGet()**](FilesApi.md#filesGet) | **GET** /files | List files |
| [**filesPost()**](FilesApi.md#filesPost) | **POST** /files | Upload a file |


## `filesFileIdGet()`

```php
filesFileIdGet($file_id): \AIStats\\Sdk\Model\FileObject
```

Retrieve a file

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\FilesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$file_id = 'file_id_example'; // string

try {
    $result = $apiInstance->filesFileIdGet($file_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FilesApi->filesFileIdGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **file_id** | **string**|  | |

### Return type

[**\AIStats\\Sdk\Model\FileObject**](../Model/FileObject.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `filesGet()`

```php
filesGet(): \AIStats\\Sdk\Model\FileListResponse
```

List files

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\FilesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);

try {
    $result = $apiInstance->filesGet();
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FilesApi->filesGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**\AIStats\\Sdk\Model\FileListResponse**](../Model/FileListResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `filesPost()`

```php
filesPost($purpose, $file): \AIStats\\Sdk\Model\FileObject
```

Upload a file

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\FilesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$purpose = 'purpose_example'; // string
$file = '/path/to/file.txt'; // \SplFileObject

try {
    $result = $apiInstance->filesPost($purpose, $file);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling FilesApi->filesPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **purpose** | **string**|  | [optional] |
| **file** | **\SplFileObject****\SplFileObject**|  | [optional] |

### Return type

[**\AIStats\\Sdk\Model\FileObject**](../Model/FileObject.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
