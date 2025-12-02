# GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model_id** | **String** | Canonical model identifier. | 
**name** | Option<**String**> | Human readable model name. | 
**release_date** | Option<[**String**](string.md)> | Earliest known public release date. | 
**announcement_date** | Option<[**String**](string.md)> | Earliest known public announcement date if different from release. | 
**status** | Option<**String**> | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). | 
**organisation** | Option<[**models::OrganisationId**](OrganisationId.md)> |  | 
**aliases** | **Vec<String>** | Enabled aliases that resolve to this model. | 
**endpoints** | **Vec<String>** | Gateway endpoints that currently route to this model. | 
**providers** | [**Vec<models::GatewayModelProvider>**](GatewayModelProvider.md) | Provider mappings that can serve this model. | 
**input_types** | **Vec<String>** | Input content types supported by the model itself. | 
**output_types** | **Vec<String>** | Output content types supported by the model itself. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


