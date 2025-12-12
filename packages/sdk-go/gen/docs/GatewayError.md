# GatewayError

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Ok** | Pointer to **bool** |  | [optional] 
**Error** | **string** |  | 
**Reason** | Pointer to **NullableString** |  | [optional] 
**Message** | Pointer to **NullableString** |  | [optional] 
**RequestId** | Pointer to **NullableString** |  | [optional] 
**TeamId** | Pointer to **NullableString** |  | [optional] 
**Model** | Pointer to **NullableString** |  | [optional] 
**Meta** | Pointer to [**GatewayErrorMeta**](GatewayErrorMeta.md) |  | [optional] 
**Timing** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewGatewayError

`func NewGatewayError(error_ string, ) *GatewayError`

NewGatewayError instantiates a new GatewayError object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayErrorWithDefaults

`func NewGatewayErrorWithDefaults() *GatewayError`

NewGatewayErrorWithDefaults instantiates a new GatewayError object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetOk

`func (o *GatewayError) GetOk() bool`

GetOk returns the Ok field if non-nil, zero value otherwise.

### GetOkOk

`func (o *GatewayError) GetOkOk() (*bool, bool)`

GetOkOk returns a tuple with the Ok field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOk

`func (o *GatewayError) SetOk(v bool)`

SetOk sets Ok field to given value.

### HasOk

`func (o *GatewayError) HasOk() bool`

HasOk returns a boolean if a field has been set.

### GetError

`func (o *GatewayError) GetError() string`

GetError returns the Error field if non-nil, zero value otherwise.

### GetErrorOk

`func (o *GatewayError) GetErrorOk() (*string, bool)`

GetErrorOk returns a tuple with the Error field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetError

`func (o *GatewayError) SetError(v string)`

SetError sets Error field to given value.


### GetReason

`func (o *GatewayError) GetReason() string`

GetReason returns the Reason field if non-nil, zero value otherwise.

### GetReasonOk

`func (o *GatewayError) GetReasonOk() (*string, bool)`

GetReasonOk returns a tuple with the Reason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReason

`func (o *GatewayError) SetReason(v string)`

SetReason sets Reason field to given value.

### HasReason

`func (o *GatewayError) HasReason() bool`

HasReason returns a boolean if a field has been set.

### SetReasonNil

`func (o *GatewayError) SetReasonNil(b bool)`

 SetReasonNil sets the value for Reason to be an explicit nil

### UnsetReason
`func (o *GatewayError) UnsetReason()`

UnsetReason ensures that no value is present for Reason, not even an explicit nil
### GetMessage

`func (o *GatewayError) GetMessage() string`

GetMessage returns the Message field if non-nil, zero value otherwise.

### GetMessageOk

`func (o *GatewayError) GetMessageOk() (*string, bool)`

GetMessageOk returns a tuple with the Message field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMessage

`func (o *GatewayError) SetMessage(v string)`

SetMessage sets Message field to given value.

### HasMessage

`func (o *GatewayError) HasMessage() bool`

HasMessage returns a boolean if a field has been set.

### SetMessageNil

`func (o *GatewayError) SetMessageNil(b bool)`

 SetMessageNil sets the value for Message to be an explicit nil

### UnsetMessage
`func (o *GatewayError) UnsetMessage()`

UnsetMessage ensures that no value is present for Message, not even an explicit nil
### GetRequestId

`func (o *GatewayError) GetRequestId() string`

GetRequestId returns the RequestId field if non-nil, zero value otherwise.

### GetRequestIdOk

`func (o *GatewayError) GetRequestIdOk() (*string, bool)`

GetRequestIdOk returns a tuple with the RequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestId

`func (o *GatewayError) SetRequestId(v string)`

SetRequestId sets RequestId field to given value.

### HasRequestId

`func (o *GatewayError) HasRequestId() bool`

HasRequestId returns a boolean if a field has been set.

### SetRequestIdNil

`func (o *GatewayError) SetRequestIdNil(b bool)`

 SetRequestIdNil sets the value for RequestId to be an explicit nil

### UnsetRequestId
`func (o *GatewayError) UnsetRequestId()`

UnsetRequestId ensures that no value is present for RequestId, not even an explicit nil
### GetTeamId

`func (o *GatewayError) GetTeamId() string`

GetTeamId returns the TeamId field if non-nil, zero value otherwise.

### GetTeamIdOk

`func (o *GatewayError) GetTeamIdOk() (*string, bool)`

GetTeamIdOk returns a tuple with the TeamId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTeamId

`func (o *GatewayError) SetTeamId(v string)`

SetTeamId sets TeamId field to given value.

### HasTeamId

`func (o *GatewayError) HasTeamId() bool`

HasTeamId returns a boolean if a field has been set.

### SetTeamIdNil

`func (o *GatewayError) SetTeamIdNil(b bool)`

 SetTeamIdNil sets the value for TeamId to be an explicit nil

### UnsetTeamId
`func (o *GatewayError) UnsetTeamId()`

UnsetTeamId ensures that no value is present for TeamId, not even an explicit nil
### GetModel

`func (o *GatewayError) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *GatewayError) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *GatewayError) SetModel(v string)`

SetModel sets Model field to given value.

### HasModel

`func (o *GatewayError) HasModel() bool`

HasModel returns a boolean if a field has been set.

### SetModelNil

`func (o *GatewayError) SetModelNil(b bool)`

 SetModelNil sets the value for Model to be an explicit nil

### UnsetModel
`func (o *GatewayError) UnsetModel()`

UnsetModel ensures that no value is present for Model, not even an explicit nil
### GetMeta

`func (o *GatewayError) GetMeta() GatewayErrorMeta`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *GatewayError) GetMetaOk() (*GatewayErrorMeta, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *GatewayError) SetMeta(v GatewayErrorMeta)`

SetMeta sets Meta field to given value.

### HasMeta

`func (o *GatewayError) HasMeta() bool`

HasMeta returns a boolean if a field has been set.

### GetTiming

`func (o *GatewayError) GetTiming() map[string]interface{}`

GetTiming returns the Timing field if non-nil, zero value otherwise.

### GetTimingOk

`func (o *GatewayError) GetTimingOk() (*map[string]interface{}, bool)`

GetTimingOk returns a tuple with the Timing field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTiming

`func (o *GatewayError) SetTiming(v map[string]interface{})`

SetTiming sets Timing field to given value.

### HasTiming

`func (o *GatewayError) HasTiming() bool`

HasTiming returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


