# \AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**health_get**](AnalyticsApi.md#health_get) | **GET** /health | Inspect provider health



## health_get

> models::GatewayHealthResponse health_get(provider, model, endpoint)
Inspect provider health

Returns the most recent latency, success rate, and breaker status for each configured provider.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**provider** | Option<**String**> | Filter to a specific provider name. |  |
**model** | Option<[**ModelId**](.md)> | Optional model id used to resolve candidate providers. |  |
**endpoint** | Option<**String**> | Endpoint identifier paired with `model` when deriving providers. |  |

### Return type

[**models::GatewayHealthResponse**](GatewayHealthResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

