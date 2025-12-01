# AIStatsSdk.Model.GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ModelId** | **string** | Canonical model identifier. | 
**Aliases** | **List&lt;string&gt;** | Enabled aliases that resolve to this model. | 
**Endpoints** | **List&lt;GatewayModel.EndpointsEnum&gt;** | Gateway endpoints that currently route to this model. | 
**Providers** | [**List&lt;GatewayModelProvider&gt;**](GatewayModelProvider.md) | Provider mappings that can serve this model. | 
**InputTypes** | **List&lt;string&gt;** | Input content types supported by the model itself. | 
**OutputTypes** | **List&lt;string&gt;** | Output content types supported by the model itself. | 
**Name** | **string** | Human readable model name. | 
**ReleaseDate** | **DateOnly** | Earliest known public release date. | 
**AnnouncementDate** | **DateOnly** | Earliest known public announcement date if different from release. | 
**Status** | **string** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). | 
**Organisation** | **OrganisationId** |  | 

[[Back to Model list]](../../README.md#documentation-for-models) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to README]](../../README.md)

