# GatewayModelProvider

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**api_provider_id** | **String** | Identifier for the provider. | 
**api_provider_name** | Option<**String**> | Human readable provider name. | 
**link** | Option<**String**> | Canonical URL for the provider. | 
**country_code** | Option<**String**> | Provider headquarters country code. | 
**endpoint** | **String** | Gateway endpoint served by this provider. | 
**provider_model_slug** | Option<**String**> | Provider specific model identifier. | 
**is_active_gateway** | **bool** | Whether the provider is currently routable via the gateway. | 
**input_modalities** | **Vec<String>** | Input modalities supported by this provider-model pairing. | 
**output_modalities** | **Vec<String>** | Output modalities supported by this provider-model pairing. | 
**effective_from** | Option<**String**> | Timestamp from which the pairing is effective. | 
**effective_to** | Option<**String**> | Timestamp when the pairing stops being effective. | 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


