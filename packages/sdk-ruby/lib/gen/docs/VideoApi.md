# AIStatsSdk::VideoApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**video_generation_post**](VideoApi.md#video_generation_post) | **POST** /video/generation | Generate video |


## video_generation_post

> <VideoGenerationResponse> video_generation_post(video_generation_request)

Generate video

Creates an async video generation job or direct asset depending on the upstream provider. The payload is returned verbatim with gateway metadata attached.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::VideoApi.new
video_generation_request = AIStatsSdk::VideoGenerationRequest.new({model: 'model_example', prompt: 'prompt_example'}) # VideoGenerationRequest | 

begin
  # Generate video
  result = api_instance.video_generation_post(video_generation_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling VideoApi->video_generation_post: #{e}"
end
```

#### Using the video_generation_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<VideoGenerationResponse>, Integer, Hash)> video_generation_post_with_http_info(video_generation_request)

```ruby
begin
  # Generate video
  data, status_code, headers = api_instance.video_generation_post_with_http_info(video_generation_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <VideoGenerationResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling VideoApi->video_generation_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **video_generation_request** | [**VideoGenerationRequest**](VideoGenerationRequest.md) |  |  |

### Return type

[**VideoGenerationResponse**](VideoGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

