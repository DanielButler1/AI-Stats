# AIStatsSdk::GatewayGenerationRecord

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **request_id** | **String** |  |  |
| **team_id** | **String** |  |  |
| **app_id** | **String** |  | [optional] |
| **app_title** | **String** |  | [optional] |
| **referer** | **String** |  | [optional] |
| **endpoint** | **String** |  |  |
| **model_id** | **String** |  | [optional] |
| **provider** | **String** |  | [optional] |
| **native_response_id** | **String** |  | [optional] |
| **stream** | **Boolean** |  | [optional] |
| **byok** | **Boolean** |  | [optional] |
| **status_code** | **Integer** |  | [optional] |
| **success** | **Boolean** |  |  |
| **error_code** | **String** |  | [optional] |
| **error_message** | **String** |  | [optional] |
| **before** | **Object** |  | [optional] |
| **execute** | **Object** |  | [optional] |
| **latency_ms** | **Float** |  | [optional] |
| **generation_ms** | **Float** |  | [optional] |
| **usage** | **Object** |  | [optional] |
| **cost_nanos** | **Integer** |  | [optional] |
| **currency** | **String** |  | [optional] |
| **pricing_lines** | **Array&lt;Object&gt;** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayGenerationRecord.new(
  request_id: null,
  team_id: null,
  app_id: null,
  app_title: null,
  referer: null,
  endpoint: null,
  model_id: null,
  provider: null,
  native_response_id: null,
  stream: null,
  byok: null,
  status_code: null,
  success: null,
  error_code: null,
  error_message: null,
  before: null,
  execute: null,
  latency_ms: null,
  generation_ms: null,
  usage: null,
  cost_nanos: null,
  currency: null,
  pricing_lines: null
)
```

