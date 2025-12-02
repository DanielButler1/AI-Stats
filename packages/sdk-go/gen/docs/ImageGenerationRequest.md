# ImageGenerationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**Prompt** | **string** |  | 
**Size** | Pointer to **string** |  | [optional] 
**N** | Pointer to **int32** |  | [optional] 

## Methods

### NewImageGenerationRequest

`func NewImageGenerationRequest(model string, prompt string, ) *ImageGenerationRequest`

NewImageGenerationRequest instantiates a new ImageGenerationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewImageGenerationRequestWithDefaults

`func NewImageGenerationRequestWithDefaults() *ImageGenerationRequest`

NewImageGenerationRequestWithDefaults instantiates a new ImageGenerationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *ImageGenerationRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ImageGenerationRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ImageGenerationRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetPrompt

`func (o *ImageGenerationRequest) GetPrompt() string`

GetPrompt returns the Prompt field if non-nil, zero value otherwise.

### GetPromptOk

`func (o *ImageGenerationRequest) GetPromptOk() (*string, bool)`

GetPromptOk returns a tuple with the Prompt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrompt

`func (o *ImageGenerationRequest) SetPrompt(v string)`

SetPrompt sets Prompt field to given value.


### GetSize

`func (o *ImageGenerationRequest) GetSize() string`

GetSize returns the Size field if non-nil, zero value otherwise.

### GetSizeOk

`func (o *ImageGenerationRequest) GetSizeOk() (*string, bool)`

GetSizeOk returns a tuple with the Size field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSize

`func (o *ImageGenerationRequest) SetSize(v string)`

SetSize sets Size field to given value.

### HasSize

`func (o *ImageGenerationRequest) HasSize() bool`

HasSize returns a boolean if a field has been set.

### GetN

`func (o *ImageGenerationRequest) GetN() int32`

GetN returns the N field if non-nil, zero value otherwise.

### GetNOk

`func (o *ImageGenerationRequest) GetNOk() (*int32, bool)`

GetNOk returns a tuple with the N field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetN

`func (o *ImageGenerationRequest) SetN(v int32)`

SetN sets N field to given value.

### HasN

`func (o *ImageGenerationRequest) HasN() bool`

HasN returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


