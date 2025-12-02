# AIStatsSdk.Api.AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**HealthGet**](AnalyticsApi.md#healthget) | **GET** /health | Inspect provider health |

<a id="healthget"></a>
# **HealthGet**
> GatewayHealthResponse HealthGet (string provider = null, ModelId model = null, string endpoint = null)

Inspect provider health

Returns the most recent latency, success rate, and breaker status for each configured provider.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **provider** | **string** | Filter to a specific provider name. | [optional]  |
| **model** | **ModelId** | Optional model id used to resolve candidate providers. | [optional]  |
| **endpoint** | **string** | Endpoint identifier paired with &#x60;model&#x60; when deriving providers. | [optional]  |

### Return type

[**GatewayHealthResponse**](GatewayHealthResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Provider health snapshot. |  -  |
| **404** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

