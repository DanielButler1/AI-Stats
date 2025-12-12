# # GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model_id** | **string** | Canonical model identifier. |
**name** | **string** | Human readable model name. |
**release_date** | **\DateTime** | Earliest known public release date. |
**status** | **string** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). |
**organisation_id** | **string** | Organisation identifier responsible for the model. |
**aliases** | **string[]** | Enabled aliases that resolve to this model. |
**endpoints** | **string[]** | Gateway endpoints that currently route to this model. |
**input_types** | **string[]** | Input content types supported by the model itself. |
**output_types** | **string[]** | Output content types supported by the model itself. |
**providers** | [**\AIStats\\Sdk\Model\ProviderInfo[]**](ProviderInfo.md) | Providers that support this model with their parameters. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
