# AIStatsSdk.Api.ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ModelsGet**](ModelsApi.md#modelsget) | **GET** /models | List all gateway models |

<a id="modelsget"></a>
# **ModelsGet**
> ModelListResponse ModelsGet (ModelsGetProviderParameter provider = null, int limit = null, int offset = null, ModelsGetOrganisationParameter organisation = null, ModelsGetIncludeEndpointsParameter includeEndpoints = null, ModelsGetIncludeEndpointsParameter excludeEndpoints = null, ModelsGetProviderParameter inputTypes = null, ModelsGetProviderParameter outputTypes = null, bool includeRumoured = null, bool includeDeprecated = null, bool includeRetired = null)

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date (falling back to announcement date) in descending order.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **provider** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Filter results to models served by one or more provider identifiers. | [optional]  |
| **limit** | **int** | Maximum number of models to return (default 50). | [optional]  |
| **offset** | **int** | Number of models to skip before starting the page. | [optional]  |
| **organisation** | [**ModelsGetOrganisationParameter**](ModelsGetOrganisationParameter.md) | Restrict results to models associated with one or more organisation identifiers. | [optional]  |
| **includeEndpoints** | [**ModelsGetIncludeEndpointsParameter**](ModelsGetIncludeEndpointsParameter.md) | Only return models that support at least one of the specified gateway endpoints. | [optional]  |
| **excludeEndpoints** | [**ModelsGetIncludeEndpointsParameter**](ModelsGetIncludeEndpointsParameter.md) | Exclude models that support any of the specified gateway endpoints. | [optional]  |
| **inputTypes** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Only return models that advertise support for at least one of the requested input content types. | [optional]  |
| **outputTypes** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Only return models that advertise support for at least one of the requested output content types. | [optional]  |
| **includeRumoured** | **bool** | Whether to include models marked as rumoured in the response (default true). | [optional] [default to true] |
| **includeDeprecated** | **bool** | Whether to include models marked as deprecated in the response (default true). | [optional] [default to true] |
| **includeRetired** | **bool** | Whether to include models marked as retired in the response (default true). | [optional] [default to true] |

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

