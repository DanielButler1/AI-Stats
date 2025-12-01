# AIStatsSdk::GatewayUsage

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **total_tokens** | **Integer** |  | [optional] |
| **input_text_tokens** | **Integer** |  | [optional] |
| **output_text_tokens** | **Integer** |  | [optional] |
| **reasoning_tokens** | **Integer** |  | [optional] |
| **cached_read_text_tokens** | **Integer** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayUsage.new(
  total_tokens: null,
  input_text_tokens: null,
  output_text_tokens: null,
  reasoning_tokens: null,
  cached_read_text_tokens: null
)
```

