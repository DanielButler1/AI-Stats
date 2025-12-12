# GenerationResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**request_id** | Option<**String**> |  | [optional]
**team_id** | Option<**String**> |  | [optional]
**app_id** | Option<**String**> |  | [optional]
**endpoint** | Option<**String**> |  | [optional]
**model_id** | Option<**String**> |  | [optional]
**provider** | Option<**String**> |  | [optional]
**native_response_id** | Option<**String**> |  | [optional]
**stream** | Option<**bool**> |  | [optional]
**byok** | Option<**bool**> |  | [optional]
**status_code** | Option<**f64**> |  | [optional]
**success** | Option<**bool**> |  | [optional]
**error_code** | Option<**String**> |  | [optional]
**error_message** | Option<**String**> |  | [optional]
**latency_ms** | Option<**f64**> |  | [optional]
**generation_ms** | Option<**f64**> |  | [optional]
**usage** | Option<[**models::GenerationResponseUsage**](GenerationResponse_usage.md)> |  | [optional]
**cost_nanos** | Option<**f64**> |  | [optional]
**currency** | Option<**String**> |  | [optional]
**pricing_lines** | Option<[**Vec<serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**key_id** | Option<**String**> |  | [optional]
**throughput** | Option<**f64**> |  | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


