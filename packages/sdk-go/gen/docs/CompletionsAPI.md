# \CompletionsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateChatCompletion**](CompletionsAPI.md#CreateChatCompletion) | **Post** /chat/completions | Create a chat completion



## CreateChatCompletion

> ChatCompletionsResponse CreateChatCompletion(ctx).ChatCompletionsRequest(chatCompletionsRequest).Execute()

Create a chat completion



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
	chatCompletionsRequest := *openapiclient.NewChatCompletionsRequest("Model_example", []openapiclient.ChatMessage{openapiclient.ChatMessage{ChatMessageAssistant: openapiclient.NewChatMessageAssistant("Role_example")}}) // ChatCompletionsRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.CompletionsAPI.CreateChatCompletion(context.Background()).ChatCompletionsRequest(chatCompletionsRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `CompletionsAPI.CreateChatCompletion``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateChatCompletion`: ChatCompletionsResponse
	fmt.Fprintf(os.Stdout, "Response from `CompletionsAPI.CreateChatCompletion`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateChatCompletionRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chatCompletionsRequest** | [**ChatCompletionsRequest**](ChatCompletionsRequest.md) |  | 

### Return type

[**ChatCompletionsResponse**](ChatCompletionsResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, text/event-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

