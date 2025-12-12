# \ModelsAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ModelsGet**](ModelsAPI.md#ModelsGet) | **Get** /models | List all gateway models



## ModelsGet

> ModelListResponse ModelsGet(ctx).Endpoints(endpoints).Organisation(organisation).InputTypes(inputTypes).OutputTypes(outputTypes).Params(params).Limit(limit).Offset(offset).Execute()

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
	endpoints := openapiclient._models_get_endpoints_parameter{ArrayOfString: new([]string)} // ModelsGetEndpointsParameter | Only return models that support at least one of the specified gateway endpoints. (optional)
	organisation := openapiclient._models_get_organisation_parameter{OrganisationId: openapiclient.OrganisationId("ai21")} // ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers. (optional)
	inputTypes := openapiclient._models_get_input_types_parameter{ArrayOfString: new([]string)} // ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested input content types. (optional)
	outputTypes := openapiclient._models_get_input_types_parameter{ArrayOfString: new([]string)} // ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested output content types. (optional)
	params := openapiclient._models_get_input_types_parameter{ArrayOfString: new([]string)} // ModelsGetInputTypesParameter | Only return models that support at least one of the specified parameters. (optional)
	limit := int32(56) // int32 | Maximum number of models to return (default 50). (optional)
	offset := int32(56) // int32 | Number of models to skip before starting the page. (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ModelsAPI.ModelsGet(context.Background()).Endpoints(endpoints).Organisation(organisation).InputTypes(inputTypes).OutputTypes(outputTypes).Params(params).Limit(limit).Offset(offset).Execute()
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
 **endpoints** | [**ModelsGetEndpointsParameter**](ModelsGetEndpointsParameter.md) | Only return models that support at least one of the specified gateway endpoints. | 
 **organisation** | [**ModelsGetOrganisationParameter**](ModelsGetOrganisationParameter.md) | Restrict results to models associated with one or more organisation identifiers. | 
 **inputTypes** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that advertise support for at least one of the requested input content types. | 
 **outputTypes** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that advertise support for at least one of the requested output content types. | 
 **params** | [**ModelsGetInputTypesParameter**](ModelsGetInputTypesParameter.md) | Only return models that support at least one of the specified parameters. | 
 **limit** | **int32** | Maximum number of models to return (default 50). | 
 **offset** | **int32** | Number of models to skip before starting the page. | 

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

