# AIStatsSdk::GatewayModelProvider

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **api_provider_id** | **String** | Identifier for the provider. |  |
| **api_provider_name** | **String** | Human readable provider name. |  |
| **link** | **String** | Canonical URL for the provider. |  |
| **country_code** | **String** | Provider headquarters country code. |  |
| **endpoint** | **String** | Gateway endpoint served by this provider. |  |
| **provider_model_slug** | **String** | Provider specific model identifier. |  |
| **is_active_gateway** | **Boolean** | Whether the provider is currently routable via the gateway. |  |
| **input_modalities** | **Array&lt;String&gt;** | Input modalities supported by this provider-model pairing. |  |
| **output_modalities** | **Array&lt;String&gt;** | Output modalities supported by this provider-model pairing. |  |
| **effective_from** | **Time** | Timestamp from which the pairing is effective. |  |
| **effective_to** | **Time** | Timestamp when the pairing stops being effective. |  |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::GatewayModelProvider.new(
  api_provider_id: null,
  api_provider_name: null,
  link: null,
  country_code: null,
  endpoint: null,
  provider_model_slug: null,
  is_active_gateway: null,
  input_modalities: null,
  output_modalities: null,
  effective_from: null,
  effective_to: null
)
```

