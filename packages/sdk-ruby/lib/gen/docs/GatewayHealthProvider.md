# AIStatsSdk::GatewayHealthProvider

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **provider** | **String** |  |  |
| **status** | **String** |  |  |
| **breaker** | **String** |  |  |
| **p50_ms** | **Float** |  | [optional] |
| **p95_ms** | **Float** |  | [optional] |
| **success_rate** | **Float** |  |  |
| **load** | **Float** |  |  |
| **last_updated** | **Integer** | Unix timestamp (ms). |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayHealthProvider.new(
  provider: null,
  status: null,
  breaker: null,
  p50_ms: null,
  p95_ms: null,
  success_rate: null,
  load: null,
  last_updated: null
)
```

