# \AnalyticsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AnalyticsPost**](AnalyticsAPI.md#AnalyticsPost) | **Post** /analytics | Aggregated usage analytics (coming soon)
[**HealthzGet**](AnalyticsAPI.md#HealthzGet) | **Get** /healthz | Gateway health check



## AnalyticsPost

> AnalyticsPost200Response AnalyticsPost(ctx).AnalyticsPostRequest(analyticsPostRequest).Execute()

Aggregated usage analytics (coming soon)



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
	analyticsPostRequest := *openapiclient.NewAnalyticsPostRequest("AccessToken_example") // AnalyticsPostRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AnalyticsAPI.AnalyticsPost(context.Background()).AnalyticsPostRequest(analyticsPostRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AnalyticsAPI.AnalyticsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `AnalyticsPost`: AnalyticsPost200Response
	fmt.Fprintf(os.Stdout, "Response from `AnalyticsAPI.AnalyticsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiAnalyticsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **analyticsPostRequest** | [**AnalyticsPostRequest**](AnalyticsPostRequest.md) |  | 

### Return type

[**AnalyticsPost200Response**](AnalyticsPost200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## HealthzGet

> HealthzGet200Response HealthzGet(ctx).Execute()

Gateway health check



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AnalyticsAPI.HealthzGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AnalyticsAPI.HealthzGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `HealthzGet`: HealthzGet200Response
	fmt.Fprintf(os.Stdout, "Response from `AnalyticsAPI.HealthzGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiHealthzGetRequest struct via the builder pattern


### Return type

[**HealthzGet200Response**](HealthzGet200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

