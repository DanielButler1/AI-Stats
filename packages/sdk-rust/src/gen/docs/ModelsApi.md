# \ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**models_get**](ModelsApi.md#models_get) | **GET** /models | List all gateway models



## models_get

> models::ModelListResponse models_get(provider, limit, offset, organisation, include_endpoints, exclude_endpoints, input_types, output_types, include_rumoured, include_deprecated, include_retired)
List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date (falling back to announcement date) in descending order.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**provider** | Option<[**ModelsGetProviderParameter**](.md)> | Filter results to models served by one or more provider identifiers. |  |
**limit** | Option<**i32**> | Maximum number of models to return (default 50). |  |
**offset** | Option<**i32**> | Number of models to skip before starting the page. |  |
**organisation** | Option<[**ModelsGetOrganisationParameter**](.md)> | Restrict results to models associated with one or more organisation identifiers. |  |
**include_endpoints** | Option<[**ModelsGetIncludeEndpointsParameter**](.md)> | Only return models that support at least one of the specified gateway endpoints. |  |
**exclude_endpoints** | Option<[**ModelsGetIncludeEndpointsParameter**](.md)> | Exclude models that support any of the specified gateway endpoints. |  |
**input_types** | Option<[**ModelsGetProviderParameter**](.md)> | Only return models that advertise support for at least one of the requested input content types. |  |
**output_types** | Option<[**ModelsGetProviderParameter**](.md)> | Only return models that advertise support for at least one of the requested output content types. |  |
**include_rumoured** | Option<**bool**> | Whether to include models marked as rumoured in the response (default true). |  |[default to true]
**include_deprecated** | Option<**bool**> | Whether to include models marked as deprecated in the response (default true). |  |[default to true]
**include_retired** | Option<**bool**> | Whether to include models marked as retired in the response (default true). |  |[default to true]

### Return type

[**models::ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

