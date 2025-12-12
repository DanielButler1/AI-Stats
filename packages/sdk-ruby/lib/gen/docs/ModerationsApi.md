# AIStatsSdk::ModerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**moderations_post**](ModerationsApi.md#moderations_post) | **POST** /moderations | Score content with moderation models |


## moderations_post

> <ModerationResponse> moderations_post(moderation_request)

Score content with moderation models

Evaluates text input against provider moderation policies and returns the gateway-normalised safety scores.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::ModerationsApi.new
moderation_request = AIStatsSdk::ModerationRequest.new({model: 'model_example', input: nil}) # ModerationRequest | 

begin
  # Score content with moderation models
  result = api_instance.moderations_post(moderation_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ModerationsApi->moderations_post: #{e}"
end
```

#### Using the moderations_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<ModerationResponse>, Integer, Hash)> moderations_post_with_http_info(moderation_request)

```ruby
begin
  # Score content with moderation models
  data, status_code, headers = api_instance.moderations_post_with_http_info(moderation_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <ModerationResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ModerationsApi->moderations_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **moderation_request** | [**ModerationRequest**](ModerationRequest.md) |  |  |

### Return type

[**ModerationResponse**](ModerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

