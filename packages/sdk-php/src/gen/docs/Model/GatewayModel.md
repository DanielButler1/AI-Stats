# # GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model_id** | **string** | Canonical model identifier. |
**name** | **string** | Human readable model name. |
**release_date** | **\DateTime** | Earliest known public release date. |
**announcement_date** | **\DateTime** | Earliest known public announcement date if different from release. |
**status** | **string** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). |
**organisation** | [**\AIStats\\Sdk\Model\OrganisationId**](OrganisationId.md) |  |
**aliases** | **string[]** | Enabled aliases that resolve to this model. |
**endpoints** | **string[]** | Gateway endpoints that currently route to this model. |
**providers** | [**\AIStats\\Sdk\Model\GatewayModelProvider[]**](GatewayModelProvider.md) | Provider mappings that can serve this model. |
**input_types** | **string[]** | Input content types supported by the model itself. |
**output_types** | **string[]** | Output content types supported by the model itself. |

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
