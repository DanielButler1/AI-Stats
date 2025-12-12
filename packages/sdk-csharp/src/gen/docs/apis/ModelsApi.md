# AIStatsSdk.Api.ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ModelsGet**](ModelsApi.md#modelsget) | **GET** /models | List all gateway models |

<a id="modelsget"></a>
# **ModelsGet**
> ModelListResponse ModelsGet (ModelsGetEndpointsParameter endpoints = null, ModelsGetOrganisationParameter organisation = null, ModelsGetInputTypesParameter inputTypes = null, ModelsGetInputTypesParameter outputTypes = null, ModelsGetInputTypesParameter varParams = null, int limit = null, int offset = null)

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date in descending order.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **endpoints** | [**ModelsGetEndpointsParameter**](ModelsGetEndpointsParameter.md) | Only return models that support at least one of the specified gateway endpoints. | [optional]  |
| **organisation** | [**ModelsGetOrganisationParameter**](ModelsGetOrganisationParameter.md) | Restrict results to models associated with one or more organisation identifiers. | [optional]  |
| **inputTypes** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that advertise support for at least one of the requested input content types. | [optional]  |
| **outputTypes** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that advertise support for at least one of the requested output content types. | [optional]  |
| **varParams** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that support at least one of the specified parameters. | [optional]  |
| **limit** | **int** | Maximum number of models to return (default 50). | [optional]  |
| **offset** | **int** | Number of models to skip before starting the page. | [optional]  |

### Return type

[**ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Paginated model catalogue. |  -  |
| **401** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

