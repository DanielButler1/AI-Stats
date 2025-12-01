# AIStatsSdk::ModelListResponse

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **ok** | **Boolean** |  |  |
| **limit** | **Integer** |  |  |
| **offset** | **Integer** |  |  |
| **models** | [**Array&lt;GatewayModel&gt;**](GatewayModel.md) |  |  |
| **total** | **Integer** | Total number of models matching the filter. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ModelListResponse.new(
  ok: null,
  limit: null,
  offset: null,
  models: null,
  total: null
)
```

