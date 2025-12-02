# AIStatsSdk::GatewayHealthResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **ok** | **Boolean** |  |  |
| **window_minutes** | **Integer** |  |  |
| **scope** | [**GatewayHealthResponseScope**](GatewayHealthResponseScope.md) |  |  |
| **overall** | [**GatewayHealthResponseOverall**](GatewayHealthResponseOverall.md) |  |  |
| **providers** | [**Array&lt;GatewayHealthProvider&gt;**](GatewayHealthProvider.md) |  |  |
| **generated_at** | **Integer** | Unix timestamp in milliseconds. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayHealthResponse.new(
  ok: null,
  window_minutes: null,
  scope: null,
  overall: null,
  providers: null,
  generated_at: null
)
```

