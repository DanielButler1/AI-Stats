# AIStatsSdk::ChatMessageAssistant

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **role** | **String** |  |  |
| **content** | [**MessageContent**](MessageContent.md) |  | [optional] |
| **name** | **String** |  | [optional] |
| **tool_calls** | [**Array&lt;ToolCall&gt;**](ToolCall.md) |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ChatMessageAssistant.new(
  role: null,
  content: null,
  name: null,
  tool_calls: null
)
```

