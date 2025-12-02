# AIStats\\Sdk\GenerationsApi

Audit and historical generation records.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**generationGet()**](GenerationsApi.md#generationGet) | **GET** /generation | Look up a past generation |


## `generationGet()`

```php
generationGet($id): \AIStats\\Sdk\Model\GatewayGenerationRecord
```

Look up a past generation

Fetches the stored audit record for a given `request_id` that belongs to your team.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\GenerationsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string | The `request_id` returned by a previous gateway response.

try {
    $result = $apiInstance->generationGet($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling GenerationsApi->generationGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **id** | **string**| The &#x60;request_id&#x60; returned by a previous gateway response. | |

### Return type

[**\AIStats\\Sdk\Model\GatewayGenerationRecord**](../Model/GatewayGenerationRecord.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
