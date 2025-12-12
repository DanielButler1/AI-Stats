# GatewayGenerationRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**request_id** | **String** |  | 
**team_id** | **String** |  | 
**app_id** | Option<**String**> |  | [optional]
**app_title** | Option<**String**> |  | [optional]
**referer** | Option<**String**> |  | [optional]
**endpoint** | **String** |  | 
**model_id** | Option<**String**> |  | [optional]
**provider** | Option<**String**> |  | [optional]
**native_response_id** | Option<**String**> |  | [optional]
**stream** | Option<**bool**> |  | [optional]
**byok** | Option<**bool**> |  | [optional]
**status_code** | Option<**i32**> |  | [optional]
**success** | **bool** |  | 
**error_code** | Option<**String**> |  | [optional]
**error_message** | Option<**String**> |  | [optional]
**before** | Option<[**std::collections::HashMap<String, serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**execute** | Option<[**std::collections::HashMap<String, serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**latency_ms** | Option<**f64**> |  | [optional]
**generation_ms** | Option<**f64**> |  | [optional]
**usage** | Option<[**std::collections::HashMap<String, serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**cost_nanos** | Option<**i32**> |  | [optional]
**currency** | Option<**String**> |  | [optional]
**pricing_lines** | Option<[**Vec<serde_json::Value>**](serde_json::Value.md)> |  | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


