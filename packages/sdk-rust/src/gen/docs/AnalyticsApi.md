# \AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**analytics_post**](AnalyticsApi.md#analytics_post) | **POST** /analytics | Aggregated usage analytics (coming soon)
[**healthz_get**](AnalyticsApi.md#healthz_get) | **GET** /healthz | Gateway health check



## analytics_post

> models::AnalyticsPost200Response analytics_post(analytics_post_request)
Aggregated usage analytics (coming soon)

Accepts an access token and will return aggregated analytics. A placeholder response is returned today while analytics is being built.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**analytics_post_request** | [**AnalyticsPostRequest**](AnalyticsPostRequest.md) |  | [required] |

### Return type

[**models::AnalyticsPost200Response**](_analytics_post_200_response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## healthz_get

> models::HealthzGet200Response healthz_get()
Gateway health check

Returns a simple liveness signal for the gateway.

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::HealthzGet200Response**](_healthz_get_200_response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

