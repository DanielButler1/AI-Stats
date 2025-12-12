# \ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**models_get**](ModelsApi.md#models_get) | **GET** /models | List all gateway models



## models_get

> models::ModelListResponse models_get(endpoints, organisation, input_types, output_types, params, limit, offset)
List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date in descending order.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**endpoints** | Option<[**ModelsGetEndpointsParameter**](.md)> | Only return models that support at least one of the specified gateway endpoints. |  |
**organisation** | Option<[**ModelsGetOrganisationParameter**](.md)> | Restrict results to models associated with one or more organisation identifiers. |  |
**input_types** | Option<[**ModelsGetInputTypesParameter**](.md)> | Only return models that advertise support for at least one of the requested input content types. |  |
**output_types** | Option<[**ModelsGetInputTypesParameter**](.md)> | Only return models that advertise support for at least one of the requested output content types. |  |
**params** | Option<[**ModelsGetInputTypesParameter**](.md)> | Only return models that support at least one of the specified parameters. |  |
**limit** | Option<**i32**> | Maximum number of models to return (default 50). |  |
**offset** | Option<**i32**> | Number of models to skip before starting the page. |  |

### Return type

[**models::ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

