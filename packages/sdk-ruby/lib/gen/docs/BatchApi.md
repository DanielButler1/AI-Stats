# AIStatsSdk::BatchApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**batches_batch_id_get**](BatchApi.md#batches_batch_id_get) | **GET** /batches/{batch_id} | Retrieve a batch job |
| [**batches_post**](BatchApi.md#batches_post) | **POST** /batches | Create a batch job |


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

api_instance = AIStatsSdk::BatchApi.new
batch_id = 'batch_id_example' # String | 

begin
  # Retrieve a batch job
  result = api_instance.batches_batch_id_get(batch_id)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BatchApi->batches_batch_id_get: #{e}"
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
  puts "Error when calling BatchApi->batches_batch_id_get_with_http_info: #{e}"
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

api_instance = AIStatsSdk::BatchApi.new
batch_request = AIStatsSdk::BatchRequest.new({input_file_id: 'input_file_id_example', endpoint: 'endpoint_example'}) # BatchRequest | 

begin
  # Create a batch job
  result = api_instance.batches_post(batch_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling BatchApi->batches_post: #{e}"
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
  puts "Error when calling BatchApi->batches_post_with_http_info: #{e}"
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

