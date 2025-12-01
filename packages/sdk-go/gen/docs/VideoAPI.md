# \VideoAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**VideoGenerationPost**](VideoAPI.md#VideoGenerationPost) | **Post** /video/generation | Generate video



## VideoGenerationPost

> VideoGenerationResponse VideoGenerationPost(ctx).VideoGenerationRequest(videoGenerationRequest).Execute()

Generate video



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
	videoGenerationRequest := *openapiclient.NewVideoGenerationRequest("Model_example", "Prompt_example") // VideoGenerationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.VideoAPI.VideoGenerationPost(context.Background()).VideoGenerationRequest(videoGenerationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `VideoAPI.VideoGenerationPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `VideoGenerationPost`: VideoGenerationResponse
	fmt.Fprintf(os.Stdout, "Response from `VideoAPI.VideoGenerationPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiVideoGenerationPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **videoGenerationRequest** | [**VideoGenerationRequest**](VideoGenerationRequest.md) |  | 

### Return type

[**VideoGenerationResponse**](VideoGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

