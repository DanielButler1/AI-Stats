# AIStatsSdk::AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**health_get**](AnalyticsApi.md#health_get) | **GET** /health | Inspect provider health |


## health_get

> <GatewayHealthResponse> health_get(opts)

Inspect provider health

Returns the most recent latency, success rate, and breaker status for each configured provider.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::AnalyticsApi.new
opts = {
  provider: 'provider_example', # String | Filter to a specific provider name.
  model: AIStatsSdk::ModelId::AI21_JAMBA_LARGE_1_5_2024_08_22, # ModelId | Optional model id used to resolve candidate providers.
  endpoint: 'chat.completions' # String | Endpoint identifier paired with `model` when deriving providers.
}

begin
  # Inspect provider health
  result = api_instance.health_get(opts)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->health_get: #{e}"
end
```

#### Using the health_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<GatewayHealthResponse>, Integer, Hash)> health_get_with_http_info(opts)

```ruby
begin
  # Inspect provider health
  data, status_code, headers = api_instance.health_get_with_http_info(opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <GatewayHealthResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->health_get_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **provider** | **String** | Filter to a specific provider name. | [optional] |
| **model** | [**ModelId**](.md) | Optional model id used to resolve candidate providers. | [optional] |
| **endpoint** | **String** | Endpoint identifier paired with &#x60;model&#x60; when deriving providers. | [optional] |

### Return type

[**GatewayHealthResponse**](GatewayHealthResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

