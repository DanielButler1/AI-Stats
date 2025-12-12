# AIStatsSdk::GatewayModel

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **model_id** | **String** | Canonical model identifier. |  |
| **name** | **String** | Human readable model name. |  |
| **release_date** | **Date** | Earliest known public release date. |  |
| **status** | **String** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). |  |
| **organisation_id** | **String** | Organisation identifier responsible for the model. |  |
| **aliases** | **Array&lt;String&gt;** | Enabled aliases that resolve to this model. |  |
| **endpoints** | **Array&lt;String&gt;** | Gateway endpoints that currently route to this model. |  |
| **input_types** | **Array&lt;String&gt;** | Input content types supported by the model itself. |  |
| **output_types** | **Array&lt;String&gt;** | Output content types supported by the model itself. |  |
| **providers** | [**Array&lt;ProviderInfo&gt;**](ProviderInfo.md) | Providers that support this model with their parameters. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayModel.new(
  model_id: null,
  name: null,
  release_date: null,
  status: null,
  organisation_id: null,
  aliases: null,
  endpoints: null,
  input_types: null,
  output_types: null,
  providers: null
)
```

