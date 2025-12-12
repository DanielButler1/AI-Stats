# ResponsesRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model** | **String** |  | 
**input** | Option<[**serde_json::Value**](.md)> |  | [optional]
**input_items** | Option<[**Vec<serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**conversation** | Option<[**models::ChatCompletionsRequestToolChoice**](ChatCompletionsRequest_tool_choice.md)> |  | [optional]
**include** | Option<**Vec<String>**> |  | [optional]
**instructions** | Option<**String**> |  | [optional]
**max_output_tokens** | Option<**i32**> |  | [optional]
**max_tool_calls** | Option<**i32**> |  | [optional]
**metadata** | Option<**std::collections::HashMap<String, String>**> |  | [optional]
**parallel_tool_calls** | Option<**bool**> |  | [optional]
**previous_response_id** | Option<**String**> |  | [optional]
**prompt** | Option<[**models::ResponsesRequestPrompt**](ResponsesRequest_prompt.md)> |  | [optional]
**prompt_cache_key** | Option<**String**> |  | [optional]
**prompt_cache_retention** | Option<**String**> |  | [optional]
**reasoning** | Option<[**models::ResponsesRequestReasoning**](ResponsesRequest_reasoning.md)> |  | [optional]
**safety_identifier** | Option<**String**> |  | [optional]
**service_tier** | Option<**String**> |  | [optional]
**store** | Option<**bool**> |  | [optional]
**stream** | Option<**bool**> |  | [optional]
**stream_options** | Option<[**serde_json::Value**](.md)> |  | [optional]
**temperature** | Option<**f64**> |  | [optional]
**text** | Option<[**serde_json::Value**](.md)> |  | [optional]
**tool_choice** | Option<[**models::ChatCompletionsRequestToolChoice**](ChatCompletionsRequest_tool_choice.md)> |  | [optional]
**tools** | Option<[**Vec<serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**top_logprobs** | Option<**i32**> |  | [optional]
**top_p** | Option<**f64**> |  | [optional]
**truncation** | Option<**String**> |  | [optional]
**background** | Option<**bool**> |  | [optional]
**user** | Option<**String**> |  | [optional]
**usage** | Option<**bool**> |  | [optional]
**meta** | Option<**bool**> |  | [optional]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


