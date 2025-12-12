# AIStatsSdk.Model.GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ModelId** | **string** | Canonical model identifier. | 
**Aliases** | **List&lt;string&gt;** | Enabled aliases that resolve to this model. | 
**Endpoints** | **List&lt;GatewayModel.EndpointsEnum&gt;** | Gateway endpoints that currently route to this model. | 
**InputTypes** | **List&lt;string&gt;** | Input content types supported by the model itself. | 
**OutputTypes** | **List&lt;string&gt;** | Output content types supported by the model itself. | 
**Providers** | [**List&lt;ProviderInfo&gt;**](ProviderInfo.md) | Providers that support this model with their parameters. | 
**Name** | **string** | Human readable model name. | 
**ReleaseDate** | **DateOnly** | Earliest known public release date. | 
**Status** | **string** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). | 
**OrganisationId** | **string** | Organisation identifier responsible for the model. | 

[[Back to Model list]](../../README.md#documentation-for-models) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to README]](../../README.md)

