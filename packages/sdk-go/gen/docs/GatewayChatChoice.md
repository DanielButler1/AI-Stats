# GatewayChatChoice

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Index** | **int32** |  | 
**Message** | [**GatewayChatChoiceMessage**](GatewayChatChoiceMessage.md) |  | 
**FinishReason** | **NullableString** | Why the model stopped generating tokens. | 
**Reasoning** | Pointer to **NullableBool** | True when the choice contains provider reasoning traces. | [optional] 

## Methods

### NewGatewayChatChoice

`func NewGatewayChatChoice(index int32, message GatewayChatChoiceMessage, finishReason NullableString, ) *GatewayChatChoice`

NewGatewayChatChoice instantiates a new GatewayChatChoice object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayChatChoiceWithDefaults

`func NewGatewayChatChoiceWithDefaults() *GatewayChatChoice`

NewGatewayChatChoiceWithDefaults instantiates a new GatewayChatChoice object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetIndex

`func (o *GatewayChatChoice) GetIndex() int32`

GetIndex returns the Index field if non-nil, zero value otherwise.

### GetIndexOk

`func (o *GatewayChatChoice) GetIndexOk() (*int32, bool)`

GetIndexOk returns a tuple with the Index field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIndex

`func (o *GatewayChatChoice) SetIndex(v int32)`

SetIndex sets Index field to given value.


### GetMessage

`func (o *GatewayChatChoice) GetMessage() GatewayChatChoiceMessage`

GetMessage returns the Message field if non-nil, zero value otherwise.

### GetMessageOk

`func (o *GatewayChatChoice) GetMessageOk() (*GatewayChatChoiceMessage, bool)`

GetMessageOk returns a tuple with the Message field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMessage

`func (o *GatewayChatChoice) SetMessage(v GatewayChatChoiceMessage)`

SetMessage sets Message field to given value.


### GetFinishReason

`func (o *GatewayChatChoice) GetFinishReason() string`

GetFinishReason returns the FinishReason field if non-nil, zero value otherwise.

### GetFinishReasonOk

`func (o *GatewayChatChoice) GetFinishReasonOk() (*string, bool)`

GetFinishReasonOk returns a tuple with the FinishReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFinishReason

`func (o *GatewayChatChoice) SetFinishReason(v string)`

SetFinishReason sets FinishReason field to given value.


### SetFinishReasonNil

`func (o *GatewayChatChoice) SetFinishReasonNil(b bool)`

 SetFinishReasonNil sets the value for FinishReason to be an explicit nil

### UnsetFinishReason
`func (o *GatewayChatChoice) UnsetFinishReason()`

UnsetFinishReason ensures that no value is present for FinishReason, not even an explicit nil
### GetReasoning

`func (o *GatewayChatChoice) GetReasoning() bool`

GetReasoning returns the Reasoning field if non-nil, zero value otherwise.

### GetReasoningOk

`func (o *GatewayChatChoice) GetReasoningOk() (*bool, bool)`

GetReasoningOk returns a tuple with the Reasoning field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReasoning

`func (o *GatewayChatChoice) SetReasoning(v bool)`

SetReasoning sets Reasoning field to given value.

### HasReasoning

`func (o *GatewayChatChoice) HasReasoning() bool`

HasReasoning returns a boolean if a field has been set.

### SetReasoningNil

`func (o *GatewayChatChoice) SetReasoningNil(b bool)`

 SetReasoningNil sets the value for Reasoning to be an explicit nil

### UnsetReasoning
`func (o *GatewayChatChoice) UnsetReasoning()`

UnsetReasoning ensures that no value is present for Reasoning, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


