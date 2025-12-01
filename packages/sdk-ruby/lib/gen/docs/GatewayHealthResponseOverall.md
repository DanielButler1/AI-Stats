# AIStatsSdk::GatewayHealthResponseOverall

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **status** | **String** |  |  |
| **providers_up** | **Integer** |  |  |
| **providers_total** | **Integer** |  |  |
| **p50_ms** | **Float** |  | [optional] |
| **p95_ms** | **Float** |  | [optional] |
| **success_rate** | **Float** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayHealthResponseOverall.new(
  status: null,
  providers_up: null,
  providers_total: null,
  p50_ms: null,
  p95_ms: null,
  success_rate: null
)
```

