# \GenerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**generation_get**](GenerationsApi.md#generation_get) | **GET** /generation | Look up a past generation



## generation_get

> models::GatewayGenerationRecord generation_get(id)
Look up a past generation

Fetches the stored audit record for a given `request_id` that belongs to your team.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** | The `request_id` returned by a previous gateway response. | [required] |

### Return type

[**models::GatewayGenerationRecord**](GatewayGenerationRecord.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

