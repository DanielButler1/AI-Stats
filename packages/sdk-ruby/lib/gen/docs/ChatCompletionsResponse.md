# AIStatsSdk::ChatCompletionsResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **native_response_id** | **String** |  | [optional] |
| **provider** | **String** |  |  |
| **meta** | [**GatewayMetadata**](GatewayMetadata.md) |  |  |
| **usage** | [**GatewayUsage**](GatewayUsage.md) |  | [optional] |
| **created** | **Integer** | Unix timestamp in seconds. |  |
| **model** | **String** |  |  |
| **choices** | [**Array&lt;GatewayChatChoice&gt;**](GatewayChatChoice.md) |  |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ChatCompletionsResponse.new(
  native_response_id: null,
  provider: null,
  meta: null,
  usage: null,
  created: null,
  model: null,
  choices: null
)
```

