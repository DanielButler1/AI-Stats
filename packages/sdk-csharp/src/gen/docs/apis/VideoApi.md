# AIStatsSdk.Api.VideoApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**VideoGenerationPost**](VideoApi.md#videogenerationpost) | **POST** /video/generation | Generate video |

<a id="videogenerationpost"></a>
# **VideoGenerationPost**
> VideoGenerationResponse VideoGenerationPost (VideoGenerationRequest videoGenerationRequest)

Generate video

Creates an async video generation job or direct asset depending on the upstream provider. The payload is returned verbatim with gateway metadata attached.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **videoGenerationRequest** | [**VideoGenerationRequest**](VideoGenerationRequest.md) |  |  |

### Return type

[**VideoGenerationResponse**](VideoGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Video generation accepted by the upstream provider. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

