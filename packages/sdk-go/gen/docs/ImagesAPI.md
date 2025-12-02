# \ImagesAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ImagesGenerationsPost**](ImagesAPI.md#ImagesGenerationsPost) | **Post** /images/generations | Generate images



## ImagesGenerationsPost

> ImageGenerationResponse ImagesGenerationsPost(ctx).ImageGenerationRequest(imageGenerationRequest).Execute()

Generate images



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
	imageGenerationRequest := *openapiclient.NewImageGenerationRequest("Model_example", "Prompt_example") // ImageGenerationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ImagesAPI.ImagesGenerationsPost(context.Background()).ImageGenerationRequest(imageGenerationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ImagesAPI.ImagesGenerationsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ImagesGenerationsPost`: ImageGenerationResponse
	fmt.Fprintf(os.Stdout, "Response from `ImagesAPI.ImagesGenerationsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiImagesGenerationsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **imageGenerationRequest** | [**ImageGenerationRequest**](ImageGenerationRequest.md) |  | 

### Return type

[**ImageGenerationResponse**](ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

