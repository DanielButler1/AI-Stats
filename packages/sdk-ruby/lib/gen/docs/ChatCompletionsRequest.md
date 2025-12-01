# AIStatsSdk::ChatCompletionsRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **reasoning** | [**ChatCompletionsRequestReasoning**](ChatCompletionsRequestReasoning.md) |  | [optional] |
| **frequency_penalty** | **Float** |  | [optional] |
| **logit_bias** | **Hash&lt;String, Float&gt;** |  | [optional] |
| **max_output_tokens** | **Integer** |  | [optional] |
| **max_completions_tokens** | **Integer** |  | [optional] |
| **meta** | **Boolean** | Include gateway metadata in the response. | [optional][default to false] |
| **model** | **String** |  |  |
| **messages** | [**Array&lt;ChatMessage&gt;**](ChatMessage.md) |  |  |
| **presence_penalty** | **Float** |  | [optional] |
| **seed** | **Integer** |  | [optional] |
| **stream** | **Boolean** |  | [optional][default to false] |
| **temperature** | **Float** |  | [optional] |
| **tools** | **Array&lt;Object&gt;** |  | [optional] |
| **max_tool_calls** | **Integer** |  | [optional] |
| **parallel_tool_calls** | **Boolean** |  | [optional][default to true] |
| **tool_choice** | [**ChatCompletionsRequestToolChoice**](ChatCompletionsRequestToolChoice.md) |  | [optional] |
| **logprobs** | **Boolean** |  | [optional] |
| **top_logprobs** | **Integer** |  | [optional] |
| **top_p** | **Float** |  | [optional] |
| **usage** | **Boolean** | Include token usage details in the response. | [optional][default to true] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ChatCompletionsRequest.new(
  reasoning: null,
  frequency_penalty: null,
  logit_bias: null,
  max_output_tokens: null,
  max_completions_tokens: null,
  meta: null,
  model: null,
  messages: null,
  presence_penalty: null,
  seed: null,
  stream: null,
  temperature: null,
  tools: null,
  max_tool_calls: null,
  parallel_tool_calls: null,
  tool_choice: null,
  logprobs: null,
  top_logprobs: null,
  top_p: null,
  usage: null
)
```

