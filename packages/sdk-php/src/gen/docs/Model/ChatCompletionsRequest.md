# # ChatCompletionsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reasoning** | [**\AIStats\\Sdk\Model\ChatCompletionsRequestReasoning**](ChatCompletionsRequestReasoning.md) |  | [optional]
**frequency_penalty** | **float** |  | [optional]
**logit_bias** | **array<string,float>** |  | [optional]
**max_output_tokens** | **int** |  | [optional]
**max_completions_tokens** | **int** |  | [optional]
**meta** | **bool** | Include gateway metadata in the response. | [optional] [default to false]
**model** | **string** |  |
**messages** | [**\AIStats\\Sdk\Model\ChatMessage[]**](ChatMessage.md) |  |
**presence_penalty** | **float** |  | [optional]
**seed** | **int** |  | [optional]
**stream** | **bool** |  | [optional] [default to false]
**temperature** | **float** |  | [optional]
**tools** | **object[]** |  | [optional]
**max_tool_calls** | **int** |  | [optional]
**parallel_tool_calls** | **bool** |  | [optional] [default to true]
**tool_choice** | [**\AIStats\\Sdk\Model\ChatCompletionsRequestToolChoice**](ChatCompletionsRequestToolChoice.md) |  | [optional]
**logprobs** | **bool** |  | [optional]
**top_logprobs** | **int** |  | [optional]
**top_p** | **float** |  | [optional]
**usage** | **bool** | Include token usage details in the response. | [optional] [default to true]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
