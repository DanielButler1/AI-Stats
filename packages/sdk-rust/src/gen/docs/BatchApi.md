# \BatchApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**batches_batch_id_get**](BatchApi.md#batches_batch_id_get) | **GET** /batches/{batch_id} | Retrieve a batch job
[**batches_post**](BatchApi.md#batches_post) | **POST** /batches | Create a batch job



## batches_batch_id_get

> models::BatchResponse batches_batch_id_get(batch_id)
Retrieve a batch job

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**batch_id** | **String** |  | [required] |

### Return type

[**models::BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## batches_post

> models::BatchResponse batches_post(batch_request)
Create a batch job

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**batch_request** | [**BatchRequest**](BatchRequest.md) |  | [required] |

### Return type

[**models::BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

