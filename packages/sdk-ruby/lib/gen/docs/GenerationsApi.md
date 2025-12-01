# AIStatsSdk::GenerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**generation_get**](GenerationsApi.md#generation_get) | **GET** /generation | Look up a past generation |


## generation_get

> <GatewayGenerationRecord> generation_get(id)

Look up a past generation

Fetches the stored audit record for a given `request_id` that belongs to your team.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::GenerationsApi.new
id = 'id_example' # String | The `request_id` returned by a previous gateway response.

begin
  # Look up a past generation
  result = api_instance.generation_get(id)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling GenerationsApi->generation_get: #{e}"
end
```

#### Using the generation_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<GatewayGenerationRecord>, Integer, Hash)> generation_get_with_http_info(id)

```ruby
begin
  # Look up a past generation
  data, status_code, headers = api_instance.generation_get_with_http_info(id)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <GatewayGenerationRecord>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling GenerationsApi->generation_get_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **id** | **String** | The &#x60;request_id&#x60; returned by a previous gateway response. |  |

### Return type

[**GatewayGenerationRecord**](GatewayGenerationRecord.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

