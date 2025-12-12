# AIStatsSdk.Api.BatchApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**BatchesBatchIdGet**](BatchApi.md#batchesbatchidget) | **GET** /batches/{batch_id} | Retrieve a batch job |
| [**BatchesPost**](BatchApi.md#batchespost) | **POST** /batches | Create a batch job |

<a id="batchesbatchidget"></a>
# **BatchesBatchIdGet**
> BatchResponse BatchesBatchIdGet (string batchId)

Retrieve a batch job


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **batchId** | **string** |  |  |

### Return type

[**BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Batch retrieved. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="batchespost"></a>
# **BatchesPost**
> BatchResponse BatchesPost (BatchRequest batchRequest)

Create a batch job


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **batchRequest** | [**BatchRequest**](BatchRequest.md) |  |  |

### Return type

[**BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Batch created. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

