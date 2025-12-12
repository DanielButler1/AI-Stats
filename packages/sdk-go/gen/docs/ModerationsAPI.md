# \ModerationsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ModerationsPost**](ModerationsAPI.md#ModerationsPost) | **Post** /moderations | Score content with moderation models



## ModerationsPost

> ModerationResponse ModerationsPost(ctx).ModerationRequest(moderationRequest).Execute()

Score content with moderation models



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
	moderationRequest := *openapiclient.NewModerationRequest("Model_example", openapiclient.ModerationRequestInput{ArrayOfModerationInputContentItem: new([]ModerationInputContentItem)}) // ModerationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ModerationsAPI.ModerationsPost(context.Background()).ModerationRequest(moderationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ModerationsAPI.ModerationsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ModerationsPost`: ModerationResponse
	fmt.Fprintf(os.Stdout, "Response from `ModerationsAPI.ModerationsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiModerationsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **moderationRequest** | [**ModerationRequest**](ModerationRequest.md) |  | 

### Return type

[**ModerationResponse**](ModerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

