# \ModelsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ModelsGet**](ModelsAPI.md#ModelsGet) | **Get** /models | List all gateway models



## ModelsGet

> ModelListResponse ModelsGet(ctx).Provider(provider).Limit(limit).Offset(offset).Organisation(organisation).IncludeEndpoints(includeEndpoints).ExcludeEndpoints(excludeEndpoints).InputTypes(inputTypes).OutputTypes(outputTypes).IncludeRumoured(includeRumoured).IncludeDeprecated(includeDeprecated).IncludeRetired(includeRetired).Execute()

List all gateway models



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
	provider := openapiclient._models_get_provider_parameter{ArrayOfString: new([]string)} // ModelsGetProviderParameter | Filter results to models served by one or more provider identifiers. (optional)
	limit := int32(56) // int32 | Maximum number of models to return (default 50). (optional)
	offset := int32(56) // int32 | Number of models to skip before starting the page. (optional)
	organisation := openapiclient._models_get_organisation_parameter{OrganisationId: openapiclient.OrganisationId("ai21")} // ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers. (optional)
	includeEndpoints := openapiclient._models_get_include_endpoints_parameter{ArrayOfString: new([]string)} // ModelsGetIncludeEndpointsParameter | Only return models that support at least one of the specified gateway endpoints. (optional)
	excludeEndpoints := openapiclient._models_get_include_endpoints_parameter{ArrayOfString: new([]string)} // ModelsGetIncludeEndpointsParameter | Exclude models that support any of the specified gateway endpoints. (optional)
	inputTypes := openapiclient._models_get_provider_parameter{ArrayOfString: new([]string)} // ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested input content types. (optional)
	outputTypes := openapiclient._models_get_provider_parameter{ArrayOfString: new([]string)} // ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested output content types. (optional)
	includeRumoured := true // bool | Whether to include models marked as rumoured in the response (default true). (optional) (default to true)
	includeDeprecated := true // bool | Whether to include models marked as deprecated in the response (default true). (optional) (default to true)
	includeRetired := true // bool | Whether to include models marked as retired in the response (default true). (optional) (default to true)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ModelsAPI.ModelsGet(context.Background()).Provider(provider).Limit(limit).Offset(offset).Organisation(organisation).IncludeEndpoints(includeEndpoints).ExcludeEndpoints(excludeEndpoints).InputTypes(inputTypes).OutputTypes(outputTypes).IncludeRumoured(includeRumoured).IncludeDeprecated(includeDeprecated).IncludeRetired(includeRetired).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ModelsAPI.ModelsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ModelsGet`: ModelListResponse
	fmt.Fprintf(os.Stdout, "Response from `ModelsAPI.ModelsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiModelsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **provider** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Filter results to models served by one or more provider identifiers. | 
 **limit** | **int32** | Maximum number of models to return (default 50). | 
 **offset** | **int32** | Number of models to skip before starting the page. | 
 **organisation** | [**ModelsGetOrganisationParameter**](ModelsGetOrganisationParameter.md) | Restrict results to models associated with one or more organisation identifiers. | 
 **includeEndpoints** | [**ModelsGetIncludeEndpointsParameter**](ModelsGetIncludeEndpointsParameter.md) | Only return models that support at least one of the specified gateway endpoints. | 
 **excludeEndpoints** | [**ModelsGetIncludeEndpointsParameter**](ModelsGetIncludeEndpointsParameter.md) | Exclude models that support any of the specified gateway endpoints. | 
 **inputTypes** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Only return models that advertise support for at least one of the requested input content types. | 
 **outputTypes** | [**ModelsGetProviderParameter**](ModelsGetProviderParameter.md) | Only return models that advertise support for at least one of the requested output content types. | 
 **includeRumoured** | **bool** | Whether to include models marked as rumoured in the response (default true). | [default to true]
 **includeDeprecated** | **bool** | Whether to include models marked as deprecated in the response (default true). | [default to true]
 **includeRetired** | **bool** | Whether to include models marked as retired in the response (default true). | [default to true]

### Return type

[**ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

