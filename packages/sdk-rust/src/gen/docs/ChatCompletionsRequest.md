# ChatCompletionsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**model** | **String** |  | 
**system** | Option<**String**> |  | [optional]
**messages** | [**Vec<models::ChatMessage>**](ChatMessage.md) |  | 
**reasoning** | Option<[**models::ChatCompletionsRequestReasoning**](ChatCompletionsRequest_reasoning.md)> |  | [optional]
**frequency_penalty** | Option<**f64**> |  | [optional]
**logit_bias** | Option<**std::collections::HashMap<String, f64>**> |  | [optional]
**max_output_tokens** | Option<**i32**> |  | [optional]
**meta** | Option<**bool**> |  | [optional][default to false]
**presence_penalty** | Option<**f64**> |  | [optional]
**seed** | Option<**i32**> |  | [optional]
**stream** | Option<**bool**> |  | [optional][default to false]
**temperature** | Option<**f64**> |  | [optional][default to 1]
**tools** | Option<[**Vec<models::ChatCompletionsRequestToolsInner>**](ChatCompletionsRequest_tools_inner.md)> |  | [optional]
**max_tool_calls** | Option<**i32**> |  | [optional]
**parallel_tool_calls** | Option<**bool**> |  | [optional][default to true]
**tool_choice** | Option<[**models::ChatCompletionsRequestToolChoice**](ChatCompletionsRequest_tool_choice.md)> |  | [optional]
**top_k** | Option<**i32**> |  | [optional]
**logprobs** | Option<**bool**> |  | [optional][default to false]
**top_logprobs** | Option<**i32**> |  | [optional]
**top_p** | Option<**f64**> |  | [optional]
**response_format** | Option<[**models::ChatCompletionsRequestResponseFormat**](ChatCompletionsRequest_response_format.md)> |  | [optional]
**usage** | Option<**bool**> |  | [optional]
**user_id** | Option<**String**> |  | [optional]
**service_tier** | Option<**String**> |  | [optional][default to Standard]

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


