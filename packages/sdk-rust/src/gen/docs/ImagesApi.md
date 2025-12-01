# \ImagesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**images_generations_post**](ImagesApi.md#images_generations_post) | **POST** /images/generations | Generate images



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

