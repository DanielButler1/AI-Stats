# AIStatsSdk.Api.CompletionsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**CreateChatCompletion**](CompletionsApi.md#createchatcompletion) | **POST** /chat/completions | Create a chat completion |

<a id="createchatcompletion"></a>
# **CreateChatCompletion**
> ChatCompletionsResponse CreateChatCompletion (ChatCompletionsRequest chatCompletionsRequest)

Create a chat completion

Routes a chat completion request to the healthiest configured provider for the requested model. The gateway normalises upstream responses and adds auditing metadata to the payload.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **chatCompletionsRequest** | [**ChatCompletionsRequest**](ChatCompletionsRequest.md) |  |  |

### Return type

[**ChatCompletionsResponse**](ChatCompletionsResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/event-stream


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Chat completion created successfully. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

