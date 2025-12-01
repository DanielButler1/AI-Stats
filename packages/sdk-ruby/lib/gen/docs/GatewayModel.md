# AIStatsSdk::GatewayModel

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **model_id** | **String** | Canonical model identifier. |  |
| **name** | **String** | Human readable model name. |  |
| **release_date** | **Date** | Earliest known public release date. |  |
| **announcement_date** | **Date** | Earliest known public announcement date if different from release. |  |
| **status** | **String** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). |  |
| **organisation** | [**OrganisationId**](OrganisationId.md) |  |  |
| **aliases** | **Array&lt;String&gt;** | Enabled aliases that resolve to this model. |  |
| **endpoints** | **Array&lt;String&gt;** | Gateway endpoints that currently route to this model. |  |
| **providers** | [**Array&lt;GatewayModelProvider&gt;**](GatewayModelProvider.md) | Provider mappings that can serve this model. |  |
| **input_types** | **Array&lt;String&gt;** | Input content types supported by the model itself. |  |
| **output_types** | **Array&lt;String&gt;** | Output content types supported by the model itself. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayModel.new(
  model_id: null,
  name: null,
  release_date: null,
  announcement_date: null,
  status: null,
  organisation: null,
  aliases: null,
  endpoints: null,
  providers: null,
  input_types: null,
  output_types: null
)
```

