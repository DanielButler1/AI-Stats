# AIStatsSdk::BetaApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**batches_batch_id_get**](BetaApi.md#batches_batch_id_get) | **GET** /batches/{batch_id} | Retrieve a batch job |
| [**batches_post**](BetaApi.md#batches_post) | **POST** /batches | Create a batch job |
| [**files_file_id_get**](BetaApi.md#files_file_id_get) | **GET** /files/{file_id} | Retrieve a file |
| [**files_get**](BetaApi.md#files_get) | **GET** /files | List files |
| [**files_post**](BetaApi.md#files_post) | **POST** /files | Upload a file |


## batches_batch_id_get

> <BatchResponse> batches_batch_id_get(batch_id)

Retrieve a batch job

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::BetaApi.new
batch_id = 'batch_id_example' # String | 

begin
  # Retrieve a batch job
  result = api_instance.batches_batch_id_get(batch_id)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->batches_batch_id_get: #{e}"
end
```

#### Using the batches_batch_id_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<BatchResponse>, Integer, Hash)> batches_batch_id_get_with_http_info(batch_id)

```ruby
begin
  # Retrieve a batch job
  data, status_code, headers = api_instance.batches_batch_id_get_with_http_info(batch_id)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <BatchResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->batches_batch_id_get_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **batch_id** | **String** |  |  |

### Return type

[**BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## batches_post

> <BatchResponse> batches_post(batch_request)

Create a batch job

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::BetaApi.new
batch_request = AIStatsSdk::BatchRequest.new({input_file_id: 'input_file_id_example', endpoint: 'endpoint_example'}) # BatchRequest | 

begin
  # Create a batch job
  result = api_instance.batches_post(batch_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->batches_post: #{e}"
end
```

#### Using the batches_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<BatchResponse>, Integer, Hash)> batches_post_with_http_info(batch_request)

```ruby
begin
  # Create a batch job
  data, status_code, headers = api_instance.batches_post_with_http_info(batch_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <BatchResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->batches_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **batch_request** | [**BatchRequest**](BatchRequest.md) |  |  |

### Return type

[**BatchResponse**](BatchResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


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

api_instance = AIStatsSdk::BetaApi.new
file_id = 'file_id_example' # String | 

begin
  # Retrieve a file
  result = api_instance.files_file_id_get(file_id)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->files_file_id_get: #{e}"
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
  puts "Error when calling BetaApi->files_file_id_get_with_http_info: #{e}"
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

api_instance = AIStatsSdk::BetaApi.new

begin
  # List files
  result = api_instance.files_get
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->files_get: #{e}"
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
  puts "Error when calling BetaApi->files_get_with_http_info: #{e}"
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

api_instance = AIStatsSdk::BetaApi.new
opts = {
  purpose: 'purpose_example', # String | 
  file: File.new('/path/to/some/file') # File | 
}

begin
  # Upload a file
  result = api_instance.files_post(opts)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BetaApi->files_post: #{e}"
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
  puts "Error when calling BetaApi->files_post_with_http_info: #{e}"
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

