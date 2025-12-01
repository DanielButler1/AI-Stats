# AIStatsSdk::ModerationResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **native_response_id** | **String** |  | [optional] |
| **provider** | **String** |  |  |
| **meta** | [**GatewayMetadata**](GatewayMetadata.md) |  |  |
| **usage** | [**GatewayUsage**](GatewayUsage.md) |  | [optional] |
| **id** | **String** |  |  |
| **created** | **Integer** |  |  |
| **model** | **String** |  |  |
| **results** | [**Array&lt;ModerationResult&gt;**](ModerationResult.md) |  |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ModerationResponse.new(
  native_response_id: null,
  provider: null,
  meta: null,
  usage: null,
  id: null,
  created: null,
  model: null,
  results: null
)
```

