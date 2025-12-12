# ResponsesResponseAllOfChoices

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Index** | **int32** |  | 
**Message** | [**ResponsesResponseAllOfMessage**](ResponsesResponseAllOfMessage.md) |  | 
**FinishReason** | **string** |  | 

## Methods

### NewResponsesResponseAllOfChoices

`func NewResponsesResponseAllOfChoices(index int32, message ResponsesResponseAllOfMessage, finishReason string, ) *ResponsesResponseAllOfChoices`

NewResponsesResponseAllOfChoices instantiates a new ResponsesResponseAllOfChoices object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewResponsesResponseAllOfChoicesWithDefaults

`func NewResponsesResponseAllOfChoicesWithDefaults() *ResponsesResponseAllOfChoices`

NewResponsesResponseAllOfChoicesWithDefaults instantiates a new ResponsesResponseAllOfChoices object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetIndex

`func (o *ResponsesResponseAllOfChoices) GetIndex() int32`

GetIndex returns the Index field if non-nil, zero value otherwise.

### GetIndexOk

`func (o *ResponsesResponseAllOfChoices) GetIndexOk() (*int32, bool)`

GetIndexOk returns a tuple with the Index field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIndex

`func (o *ResponsesResponseAllOfChoices) SetIndex(v int32)`

SetIndex sets Index field to given value.


### GetMessage

`func (o *ResponsesResponseAllOfChoices) GetMessage() ResponsesResponseAllOfMessage`

GetMessage returns the Message field if non-nil, zero value otherwise.

### GetMessageOk

`func (o *ResponsesResponseAllOfChoices) GetMessageOk() (*ResponsesResponseAllOfMessage, bool)`

GetMessageOk returns a tuple with the Message field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMessage

`func (o *ResponsesResponseAllOfChoices) SetMessage(v ResponsesResponseAllOfMessage)`

SetMessage sets Message field to given value.


### GetFinishReason

`func (o *ResponsesResponseAllOfChoices) GetFinishReason() string`

GetFinishReason returns the FinishReason field if non-nil, zero value otherwise.

### GetFinishReasonOk

`func (o *ResponsesResponseAllOfChoices) GetFinishReasonOk() (*string, bool)`

GetFinishReasonOk returns a tuple with the FinishReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFinishReason

`func (o *ResponsesResponseAllOfChoices) SetFinishReason(v string)`

SetFinishReason sets FinishReason field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


