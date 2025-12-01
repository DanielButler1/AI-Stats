# AIStatsSdk::GatewayError

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **ok** | **Boolean** |  | [optional] |
| **error** | **String** |  |  |
| **reason** | **String** |  | [optional] |
| **message** | **String** |  | [optional] |
| **request_id** | **String** |  | [optional] |
| **team_id** | **String** |  | [optional] |
| **model** | **String** |  | [optional] |
| **meta** | [**GatewayErrorMeta**](GatewayErrorMeta.md) |  | [optional] |
| **timing** | **Object** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayError.new(
  ok: null,
  error: null,
  reason: null,
  message: null,
  request_id: null,
  team_id: null,
  model: null,
  meta: null,
  timing: null
)
```

