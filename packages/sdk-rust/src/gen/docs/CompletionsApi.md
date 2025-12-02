# \CompletionsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_chat_completion**](CompletionsApi.md#create_chat_completion) | **POST** /chat/completions | Create a chat completion



## create_chat_completion

> models::ChatCompletionsResponse create_chat_completion(chat_completions_request)
Create a chat completion

Routes a chat completion request to the healthiest configured provider for the requested model. The gateway normalises upstream responses and adds auditing metadata to the payload.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**chat_completions_request** | [**ChatCompletionsRequest**](ChatCompletionsRequest.md) |  | [required] |

### Return type

[**models::ChatCompletionsResponse**](ChatCompletionsResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, text/event-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

