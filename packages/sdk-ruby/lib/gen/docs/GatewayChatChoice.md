# AIStatsSdk::GatewayChatChoice

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **index** | **Integer** |  |  |
| **message** | [**GatewayChatChoiceMessage**](GatewayChatChoiceMessage.md) |  |  |
| **finish_reason** | **String** | Why the model stopped generating tokens. |  |
| **reasoning** | **Boolean** | True when the choice contains provider reasoning traces. | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayChatChoice.new(
  index: null,
  message: null,
  finish_reason: null,
  reasoning: null
)
```

