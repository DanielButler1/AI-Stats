# AIStatsSdk.Api.GenerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**GenerationGet**](GenerationsApi.md#generationget) | **GET** /generation | Look up a past generation |

<a id="generationget"></a>
# **GenerationGet**
> GatewayGenerationRecord GenerationGet (string id)

Look up a past generation

Fetches the stored audit record for a given `request_id` that belongs to your team.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** | The &#x60;request_id&#x60; returned by a previous gateway response. |  |

### Return type

[**GatewayGenerationRecord**](GatewayGenerationRecord.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Generation record located. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

