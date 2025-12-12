# GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model_id** | **String** | Canonical model identifier. | 
**name** | Option<**String**> | Human readable model name. | 
**release_date** | Option<[**String**](string.md)> | Earliest known public release date. | 
**status** | Option<**String**> | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). | 
**organisation_id** | Option<**String**> | Organisation identifier responsible for the model. | 
**aliases** | **Vec<String>** | Enabled aliases that resolve to this model. | 
**endpoints** | **Vec<String>** | Gateway endpoints that currently route to this model. | 
**input_types** | **Vec<String>** | Input content types supported by the model itself. | 
**output_types** | **Vec<String>** | Output content types supported by the model itself. | 
**providers** | [**Vec<models::ProviderInfo>**](ProviderInfo.md) | Providers that support this model with their parameters. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


