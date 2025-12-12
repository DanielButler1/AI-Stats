# AIStatsSdk.Api.AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**AnalyticsPost**](AnalyticsApi.md#analyticspost) | **POST** /analytics | Aggregated usage analytics (coming soon) |
| [**HealthzGet**](AnalyticsApi.md#healthzget) | **GET** /healthz | Gateway health check |

<a id="analyticspost"></a>
# **AnalyticsPost**
> AnalyticsPost200Response AnalyticsPost (AnalyticsPostRequest analyticsPostRequest)

Aggregated usage analytics (coming soon)

Accepts an access token and will return aggregated analytics. A placeholder response is returned today while analytics is being built.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **analyticsPostRequest** | [**AnalyticsPostRequest**](AnalyticsPostRequest.md) |  |  |

### Return type

[**AnalyticsPost200Response**](AnalyticsPost200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Placeholder analytics response (coming soon). |  -  |
| **400** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="healthzget"></a>
# **HealthzGet**
> HealthzGet200Response HealthzGet ()

Gateway health check

Returns a simple liveness signal for the gateway.


### Parameters
This endpoint does not need any parameter.
### Return type

[**HealthzGet200Response**](HealthzGet200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Gateway is healthy. |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

