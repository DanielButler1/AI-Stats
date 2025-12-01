# AIStatsSdk.Model.ChatCompletionsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**Messages** | [**List&lt;ChatMessage&gt;**](ChatMessage.md) |  | 
**Reasoning** | [**ChatCompletionsRequestReasoning**](ChatCompletionsRequestReasoning.md) |  | [optional] 
**FrequencyPenalty** | **decimal** |  | [optional] 
**LogitBias** | **Dictionary&lt;string, decimal&gt;** |  | [optional] 
**MaxOutputTokens** | **int** |  | [optional] 
**MaxCompletionsTokens** | **int** |  | [optional] 
**Meta** | **bool** | Include gateway metadata in the response. | [optional] [default to false]
**PresencePenalty** | **decimal** |  | [optional] 
**Seed** | **long** |  | [optional] 
**Stream** | **bool** |  | [optional] [default to false]
**Temperature** | **decimal** |  | [optional] 
**Tools** | **List&lt;Object&gt;** |  | [optional] 
**MaxToolCalls** | **int** |  | [optional] 
**ParallelToolCalls** | **bool** |  | [optional] [default to true]
**ToolChoice** | [**ChatCompletionsRequestToolChoice**](ChatCompletionsRequestToolChoice.md) |  | [optional] 
**Logprobs** | **bool** |  | [optional] 
**TopLogprobs** | **int** |  | [optional] 
**TopP** | **decimal** |  | [optional] 
**Usage** | **bool** | Include token usage details in the response. | [optional] [default to true]

[[Back to Model list]](../../README.md#documentation-for-models) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to README]](../../README.md)

