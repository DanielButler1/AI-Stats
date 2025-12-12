# \ResponsesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_response**](ResponsesApi.md#create_response) | **POST** /responses | Create a Response



## create_response

> models::ResponsesResponse create_response(responses_request)
Create a Response

Creates a model response

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**responses_request** | [**ResponsesRequest**](ResponsesRequest.md) |  | [required] |

### Return type

[**models::ResponsesResponse**](ResponsesResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, text/event-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

