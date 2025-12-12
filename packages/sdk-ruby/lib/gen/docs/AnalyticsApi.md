# AIStatsSdk::AnalyticsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**analytics_post**](AnalyticsApi.md#analytics_post) | **POST** /analytics | Aggregated usage analytics (coming soon) |
| [**healthz_get**](AnalyticsApi.md#healthz_get) | **GET** /healthz | Gateway health check |


## analytics_post

> <AnalyticsPost200Response> analytics_post(analytics_post_request)

Aggregated usage analytics (coming soon)

Accepts an access token and will return aggregated analytics. A placeholder response is returned today while analytics is being built.

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
analytics_post_request = AIStatsSdk::AnalyticsPostRequest.new({access_token: 'access_token_example'}) # AnalyticsPostRequest | 

begin
  # Aggregated usage analytics (coming soon)
  result = api_instance.analytics_post(analytics_post_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->analytics_post: #{e}"
end
```

#### Using the analytics_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<AnalyticsPost200Response>, Integer, Hash)> analytics_post_with_http_info(analytics_post_request)

```ruby
begin
  # Aggregated usage analytics (coming soon)
  data, status_code, headers = api_instance.analytics_post_with_http_info(analytics_post_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <AnalyticsPost200Response>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->analytics_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **analytics_post_request** | [**AnalyticsPostRequest**](AnalyticsPostRequest.md) |  |  |

### Return type

[**AnalyticsPost200Response**](AnalyticsPost200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## healthz_get

> <HealthzGet200Response> healthz_get

Gateway health check

Returns a simple liveness signal for the gateway.

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

begin
  # Gateway health check
  result = api_instance.healthz_get
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->healthz_get: #{e}"
end
```

#### Using the healthz_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<HealthzGet200Response>, Integer, Hash)> healthz_get_with_http_info

```ruby
begin
  # Gateway health check
  data, status_code, headers = api_instance.healthz_get_with_http_info
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <HealthzGet200Response>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AnalyticsApi->healthz_get_with_http_info: #{e}"
end
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**HealthzGet200Response**](HealthzGet200Response.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

