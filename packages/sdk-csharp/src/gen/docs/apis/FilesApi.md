# AIStatsSdk.Api.FilesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**FilesFileIdGet**](FilesApi.md#filesfileidget) | **GET** /files/{file_id} | Retrieve a file |
| [**FilesGet**](FilesApi.md#filesget) | **GET** /files | List files |
| [**FilesPost**](FilesApi.md#filespost) | **POST** /files | Upload a file |

<a id="filesfileidget"></a>
# **FilesFileIdGet**
> FileObject FilesFileIdGet (string fileId)

Retrieve a file


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **fileId** | **string** |  |  |

### Return type

[**FileObject**](FileObject.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | File metadata. |  -  |
| **404** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="filesget"></a>
# **FilesGet**
> FileListResponse FilesGet ()

List files


### Parameters
This endpoint does not need any parameter.
### Return type

[**FileListResponse**](FileListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Files listed. |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="filespost"></a>
# **FilesPost**
> FileObject FilesPost (string purpose = null, System.IO.Stream file = null)

Upload a file


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **purpose** | **string** |  | [optional]  |
| **file** | **System.IO.Stream****System.IO.Stream** |  | [optional]  |

### Return type

[**FileObject**](FileObject.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | File uploaded. |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

