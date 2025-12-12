# AIStatsSdk::ResponsesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**create_response**](ResponsesApi.md#create_response) | **POST** /responses | Create a Response |


## create_response

> <ResponsesResponse> create_response(responses_request)

Create a Response

Creates a model response

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::ResponsesApi.new
responses_request = AIStatsSdk::ResponsesRequest.new({model: 'model_example'}) # ResponsesRequest | 

begin
  # Create a Response
  result = api_instance.create_response(responses_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ResponsesApi->create_response: #{e}"
end
```

#### Using the create_response_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<ResponsesResponse>, Integer, Hash)> create_response_with_http_info(responses_request)

```ruby
begin
  # Create a Response
  data, status_code, headers = api_instance.create_response_with_http_info(responses_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <ResponsesResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ResponsesApi->create_response_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **responses_request** | [**ResponsesRequest**](ResponsesRequest.md) |  |  |

### Return type

[**ResponsesResponse**](ResponsesResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, text/event-stream

