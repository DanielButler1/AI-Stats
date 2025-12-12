# AIStats\\Sdk\ModelsApi

Listings of models and available providers.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**modelsGet()**](ModelsApi.md#modelsGet) | **GET** /models | List all gateway models |


## `modelsGet()`

```php
modelsGet($endpoints, $organisation, $input_types, $output_types, $params, $limit, $offset): \AIStats\\Sdk\Model\ModelListResponse
```

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date in descending order.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\ModelsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$endpoints = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetEndpointsParameter(); // \AIStats\\Sdk\Model\ModelsGetEndpointsParameter | Only return models that support at least one of the specified gateway endpoints.
$organisation = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetOrganisationParameter(); // \AIStats\\Sdk\Model\ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers.
$input_types = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetInputTypesParameter(); // \AIStats\\Sdk\Model\ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested input content types.
$output_types = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetInputTypesParameter(); // \AIStats\\Sdk\Model\ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested output content types.
$params = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelsGetInputTypesParameter(); // \AIStats\\Sdk\Model\ModelsGetInputTypesParameter | Only return models that support at least one of the specified parameters.
$limit = 56; // int | Maximum number of models to return (default 50).
$offset = 56; // int | Number of models to skip before starting the page.

try {
    $result = $apiInstance->modelsGet($endpoints, $organisation, $input_types, $output_types, $params, $limit, $offset);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ModelsApi->modelsGet: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **endpoints** | [**\AIStats\\Sdk\Model\ModelsGetEndpointsParameter**](../Model/.md)| Only return models that support at least one of the specified gateway endpoints. | [optional] |
| **organisation** | [**\AIStats\\Sdk\Model\ModelsGetOrganisationParameter**](../Model/.md)| Restrict results to models associated with one or more organisation identifiers. | [optional] |
| **input_types** | [**\AIStats\\Sdk\Model\ModelsGetInputTypesParameter**](../Model/.md)| Only return models that advertise support for at least one of the requested input content types. | [optional] |
| **output_types** | [**\AIStats\\Sdk\Model\ModelsGetInputTypesParameter**](../Model/.md)| Only return models that advertise support for at least one of the requested output content types. | [optional] |
| **params** | [**\AIStats\\Sdk\Model\ModelsGetInputTypesParameter**](../Model/.md)| Only return models that support at least one of the specified parameters. | [optional] |
| **limit** | **int**| Maximum number of models to return (default 50). | [optional] |
| **offset** | **int**| Number of models to skip before starting the page. | [optional] |

### Return type

[**\AIStats\\Sdk\Model\ModelListResponse**](../Model/ModelListResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
