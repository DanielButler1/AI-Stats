# \AnalyticsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**HealthGet**](AnalyticsAPI.md#HealthGet) | **Get** /health | Inspect provider health



## HealthGet

> GatewayHealthResponse HealthGet(ctx).Provider(provider).Model(model).Endpoint(endpoint).Execute()

Inspect provider health



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
	provider := "provider_example" // string | Filter to a specific provider name. (optional)
	model := openapiclient.ModelId("ai21/jamba-large-1-5-2024-08-22") // ModelId | Optional model id used to resolve candidate providers. (optional)
	endpoint := "endpoint_example" // string | Endpoint identifier paired with `model` when deriving providers. (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AnalyticsAPI.HealthGet(context.Background()).Provider(provider).Model(model).Endpoint(endpoint).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AnalyticsAPI.HealthGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `HealthGet`: GatewayHealthResponse
	fmt.Fprintf(os.Stdout, "Response from `AnalyticsAPI.HealthGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiHealthGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **provider** | **string** | Filter to a specific provider name. | 
 **model** | [**ModelId**](ModelId.md) | Optional model id used to resolve candidate providers. | 
 **endpoint** | **string** | Endpoint identifier paired with &#x60;model&#x60; when deriving providers. | 

### Return type

[**GatewayHealthResponse**](GatewayHealthResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

