# ChatCompletionsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reasoning** | Option<[**models::ChatCompletionsRequestReasoning**](ChatCompletionsRequest_reasoning.md)> |  | [optional]
**frequency_penalty** | Option<**f64**> |  | [optional]
**logit_bias** | Option<**std::collections::HashMap<String, f64>**> |  | [optional]
**max_output_tokens** | Option<**i32**> |  | [optional]
**max_completions_tokens** | Option<**i32**> |  | [optional]
**meta** | Option<**bool**> | Include gateway metadata in the response. | [optional][default to false]
**model** | **String** |  | 
**messages** | [**Vec<models::ChatMessage>**](ChatMessage.md) |  | 
**presence_penalty** | Option<**f64**> |  | [optional]
**seed** | Option<**i32**> |  | [optional]
**stream** | Option<**bool**> |  | [optional][default to false]
**temperature** | Option<**f64**> |  | [optional]
**tools** | Option<[**Vec<serde_json::Value>**](serde_json::Value.md)> |  | [optional]
**max_tool_calls** | Option<**i32**> |  | [optional]
**parallel_tool_calls** | Option<**bool**> |  | [optional][default to true]
**tool_choice** | Option<[**models::ChatCompletionsRequestToolChoice**](ChatCompletionsRequest_tool_choice.md)> |  | [optional]
**logprobs** | Option<**bool**> |  | [optional]
**top_logprobs** | Option<**i32**> |  | [optional]
**top_p** | Option<**f64**> |  | [optional]
**usage** | Option<**bool**> | Include token usage details in the response. | [optional][default to true]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


