# # GatewayModelProvider

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**api_provider_id** | **string** | Identifier for the provider. |
**api_provider_name** | **string** | Human readable provider name. |
**link** | **string** | Canonical URL for the provider. |
**country_code** | **string** | Provider headquarters country code. |
**endpoint** | **string** | Gateway endpoint served by this provider. |
**provider_model_slug** | **string** | Provider specific model identifier. |
**is_active_gateway** | **bool** | Whether the provider is currently routable via the gateway. |
**input_modalities** | **string[]** | Input modalities supported by this provider-model pairing. |
**output_modalities** | **string[]** | Output modalities supported by this provider-model pairing. |
**effective_from** | **\DateTime** | Timestamp from which the pairing is effective. |
**effective_to** | **\DateTime** | Timestamp when the pairing stops being effective. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
