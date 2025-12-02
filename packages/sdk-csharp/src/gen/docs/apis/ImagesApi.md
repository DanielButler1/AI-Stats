# AIStatsSdk.Api.ImagesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ImagesGenerationsPost**](ImagesApi.md#imagesgenerationspost) | **POST** /images/generations | Generate images |

<a id="imagesgenerationspost"></a>
# **ImagesGenerationsPost**
> ImageGenerationResponse ImagesGenerationsPost (ImageGenerationRequest imageGenerationRequest)

Generate images

Creates one or more images from a text prompt using the configured provider for the requested model.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **imageGenerationRequest** | [**ImageGenerationRequest**](ImageGenerationRequest.md) |  |  |

### Return type

[**ImageGenerationResponse**](ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Image generation completed. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

