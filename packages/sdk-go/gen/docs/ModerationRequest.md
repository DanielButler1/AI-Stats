# ModerationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**Input** | [**ModerationRequestInput**](ModerationRequestInput.md) |  | 

## Methods

### NewModerationRequest

`func NewModerationRequest(model string, input ModerationRequestInput, ) *ModerationRequest`

NewModerationRequest instantiates a new ModerationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewModerationRequestWithDefaults

`func NewModerationRequestWithDefaults() *ModerationRequest`

NewModerationRequestWithDefaults instantiates a new ModerationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *ModerationRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ModerationRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ModerationRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetInput

`func (o *ModerationRequest) GetInput() ModerationRequestInput`

GetInput returns the Input field if non-nil, zero value otherwise.

### GetInputOk

`func (o *ModerationRequest) GetInputOk() (*ModerationRequestInput, bool)`

GetInputOk returns a tuple with the Input field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInput

`func (o *ModerationRequest) SetInput(v ModerationRequestInput)`

SetInput sets Input field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


