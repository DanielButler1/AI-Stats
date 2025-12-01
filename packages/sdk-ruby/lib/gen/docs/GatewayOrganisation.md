# AIStatsSdk::GatewayOrganisation

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **organisation_id** | [**OrganisationId**](OrganisationId.md) |  |  |
| **name** | **String** | Display name for the organisation. |  |
| **country_code** | **String** | ISO 3166-1 alpha-2 country code. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayOrganisation.new(
  organisation_id: null,
  name: null,
  country_code: null
)
```

