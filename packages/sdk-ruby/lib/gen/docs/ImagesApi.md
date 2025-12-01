# AIStatsSdk::ImagesApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**images_generations_post**](ImagesApi.md#images_generations_post) | **POST** /images/generations | Generate images |


## images_generations_post

> <ImageGenerationResponse> images_generations_post(image_generation_request)

Generate images

Creates one or more images from a text prompt using the configured provider for the requested model.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::ImagesApi.new
image_generation_request = AIStatsSdk::ImageGenerationRequest.new({model: 'model_example', prompt: 'prompt_example'}) # ImageGenerationRequest | 

begin
  # Generate images
  result = api_instance.images_generations_post(image_generation_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ImagesApi->images_generations_post: #{e}"
end
```

#### Using the images_generations_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<ImageGenerationResponse>, Integer, Hash)> images_generations_post_with_http_info(image_generation_request)

```ruby
begin
  # Generate images
  data, status_code, headers = api_instance.images_generations_post_with_http_info(image_generation_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <ImageGenerationResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ImagesApi->images_generations_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **image_generation_request** | [**ImageGenerationRequest**](ImageGenerationRequest.md) |  |  |

### Return type

[**ImageGenerationResponse**](ImageGenerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

