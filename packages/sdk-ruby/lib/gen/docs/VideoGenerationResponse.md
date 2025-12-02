# AIStatsSdk::VideoGenerationResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **native_response_id** | **String** |  | [optional] |
| **provider** | **String** |  |  |
| **meta** | [**GatewayMetadata**](GatewayMetadata.md) |  |  |
| **usage** | [**GatewayUsage**](GatewayUsage.md) |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::VideoGenerationResponse.new(
  native_response_id: null,
  provider: null,
  meta: null,
  usage: null
)
```

