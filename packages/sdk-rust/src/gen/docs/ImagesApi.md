# \ImagesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**images_edits_post**](ImagesApi.md#images_edits_post) | **POST** /images/edits | Edit an image
[**images_generations_post**](ImagesApi.md#images_generations_post) | **POST** /images/generations | Generate images



## images_edits_post

> models::ImageGenerationResponse images_edits_post(images_edit_request)
Edit an image

Applies edits to an existing image using the specified model and prompt.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**images_edit_request** | [**ImagesEditRequest**](ImagesEditRequest.md) |  | [required] |

### Return type

[**models::ImageGenerationResponse**](ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## images_generations_post

> models::ImageGenerationResponse images_generations_post(image_generation_request)
Generate images

Creates one or more images from a text prompt using the configured provider for the requested model.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**image_generation_request** | [**ImageGenerationRequest**](ImageGenerationRequest.md) |  | [required] |

### Return type

[**models::ImageGenerationResponse**](ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

