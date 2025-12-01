# \VideoApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**video_generation_post**](VideoApi.md#video_generation_post) | **POST** /video/generation | Generate video



## video_generation_post

> models::VideoGenerationResponse video_generation_post(video_generation_request)
Generate video

Creates an async video generation job or direct asset depending on the upstream provider. The payload is returned verbatim with gateway metadata attached.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**video_generation_request** | [**VideoGenerationRequest**](VideoGenerationRequest.md) |  | [required] |

### Return type

[**models::VideoGenerationResponse**](VideoGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

