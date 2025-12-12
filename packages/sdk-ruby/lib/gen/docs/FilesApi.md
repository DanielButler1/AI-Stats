# AIStatsSdk::FilesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**files_file_id_get**](FilesApi.md#files_file_id_get) | **GET** /files/{file_id} | Retrieve a file |
| [**files_get**](FilesApi.md#files_get) | **GET** /files | List files |
| [**files_post**](FilesApi.md#files_post) | **POST** /files | Upload a file |


## files_file_id_get

> <FileObject> files_file_id_get(file_id)

Retrieve a file

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::FilesApi.new
file_id = 'file_id_example' # String | 

begin
  # Retrieve a file
  result = api_instance.files_file_id_get(file_id)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_file_id_get: #{e}"
end
```

#### Using the files_file_id_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<FileObject>, Integer, Hash)> files_file_id_get_with_http_info(file_id)

```ruby
begin
  # Retrieve a file
  data, status_code, headers = api_instance.files_file_id_get_with_http_info(file_id)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <FileObject>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_file_id_get_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **file_id** | **String** |  |  |

### Return type

[**FileObject**](FileObject.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## files_get

> <FileListResponse> files_get

List files

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::FilesApi.new

begin
  # List files
  result = api_instance.files_get
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_get: #{e}"
end
```

#### Using the files_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<FileListResponse>, Integer, Hash)> files_get_with_http_info

```ruby
begin
  # List files
  data, status_code, headers = api_instance.files_get_with_http_info
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <FileListResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_get_with_http_info: #{e}"
end
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**FileListResponse**](FileListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## files_post

> <FileObject> files_post(opts)

Upload a file

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::FilesApi.new
opts = {
  purpose: 'purpose_example', # String | 
  file: File.new('/path/to/some/file') # File | 
}

begin
  # Upload a file
  result = api_instance.files_post(opts)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_post: #{e}"
end
```

#### Using the files_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<FileObject>, Integer, Hash)> files_post_with_http_info(opts)

```ruby
begin
  # Upload a file
  data, status_code, headers = api_instance.files_post_with_http_info(opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <FileObject>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling FilesApi->files_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **purpose** | **String** |  | [optional] |
| **file** | **File** |  | [optional] |

### Return type

[**FileObject**](FileObject.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

