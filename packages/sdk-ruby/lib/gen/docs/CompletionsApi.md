# AIStatsSdk::CompletionsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**create_chat_completion**](CompletionsApi.md#create_chat_completion) | **POST** /chat/completions | Create a chat completion |


## create_chat_completion

> <ChatCompletionsResponse> create_chat_completion(chat_completions_request)

Create a chat completion

Routes a chat completion request to the healthiest configured provider for the requested model. The gateway normalises upstream responses and adds auditing metadata to the payload.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::CompletionsApi.new
chat_completions_request = AIStatsSdk::ChatCompletionsRequest.new({model: 'model_example', messages: [AIStatsSdk::ChatMessageAssistant.new({role: 'assistant'})]}) # ChatCompletionsRequest | 

begin
  # Create a chat completion
  result = api_instance.create_chat_completion(chat_completions_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling CompletionsApi->create_chat_completion: #{e}"
end
```

#### Using the create_chat_completion_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<ChatCompletionsResponse>, Integer, Hash)> create_chat_completion_with_http_info(chat_completions_request)

```ruby
begin
  # Create a chat completion
  data, status_code, headers = api_instance.create_chat_completion_with_http_info(chat_completions_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <ChatCompletionsResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling CompletionsApi->create_chat_completion_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **chat_completions_request** | [**ChatCompletionsRequest**](ChatCompletionsRequest.md) |  |  |

### Return type

[**ChatCompletionsResponse**](ChatCompletionsResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, text/event-stream

