# AIStatsSdk::GatewayMetadata

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **request_id** | **String** |  |  |
| **provider** | **String** |  |  |
| **endpoint** | **String** |  |  |
| **model** | [**ModelId**](ModelId.md) |  |  |
| **app_title** | **String** |  | [optional] |
| **referer** | **String** |  | [optional] |
| **timing** | **Object** | Optional timing information captured during the request lifecycle. | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayMetadata.new(
  request_id: null,
  provider: null,
  endpoint: null,
  model: null,
  app_title: null,
  referer: null,
  timing: null
)
```

