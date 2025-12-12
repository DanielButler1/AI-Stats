# ImagesEditRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**Prompt** | **string** |  | 
**Image** | **string** |  | 
**Mask** | Pointer to **string** |  | [optional] 
**N** | Pointer to **int32** |  | [optional] 
**Size** | Pointer to **string** |  | [optional] 
**User** | Pointer to **string** |  | [optional] 

## Methods

### NewImagesEditRequest

`func NewImagesEditRequest(model string, prompt string, image string, ) *ImagesEditRequest`

NewImagesEditRequest instantiates a new ImagesEditRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewImagesEditRequestWithDefaults

`func NewImagesEditRequestWithDefaults() *ImagesEditRequest`

NewImagesEditRequestWithDefaults instantiates a new ImagesEditRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *ImagesEditRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ImagesEditRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ImagesEditRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetPrompt

`func (o *ImagesEditRequest) GetPrompt() string`

GetPrompt returns the Prompt field if non-nil, zero value otherwise.

### GetPromptOk

`func (o *ImagesEditRequest) GetPromptOk() (*string, bool)`

GetPromptOk returns a tuple with the Prompt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrompt

`func (o *ImagesEditRequest) SetPrompt(v string)`

SetPrompt sets Prompt field to given value.


### GetImage

`func (o *ImagesEditRequest) GetImage() string`

GetImage returns the Image field if non-nil, zero value otherwise.

### GetImageOk

`func (o *ImagesEditRequest) GetImageOk() (*string, bool)`

GetImageOk returns a tuple with the Image field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImage

`func (o *ImagesEditRequest) SetImage(v string)`

SetImage sets Image field to given value.


### GetMask

`func (o *ImagesEditRequest) GetMask() string`

GetMask returns the Mask field if non-nil, zero value otherwise.

### GetMaskOk

`func (o *ImagesEditRequest) GetMaskOk() (*string, bool)`

GetMaskOk returns a tuple with the Mask field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMask

`func (o *ImagesEditRequest) SetMask(v string)`

SetMask sets Mask field to given value.

### HasMask

`func (o *ImagesEditRequest) HasMask() bool`

HasMask returns a boolean if a field has been set.

### GetN

`func (o *ImagesEditRequest) GetN() int32`

GetN returns the N field if non-nil, zero value otherwise.

### GetNOk

`func (o *ImagesEditRequest) GetNOk() (*int32, bool)`

GetNOk returns a tuple with the N field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetN

`func (o *ImagesEditRequest) SetN(v int32)`

SetN sets N field to given value.

### HasN

`func (o *ImagesEditRequest) HasN() bool`

HasN returns a boolean if a field has been set.

### GetSize

`func (o *ImagesEditRequest) GetSize() string`

GetSize returns the Size field if non-nil, zero value otherwise.

### GetSizeOk

`func (o *ImagesEditRequest) GetSizeOk() (*string, bool)`

GetSizeOk returns a tuple with the Size field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSize

`func (o *ImagesEditRequest) SetSize(v string)`

SetSize sets Size field to given value.

### HasSize

`func (o *ImagesEditRequest) HasSize() bool`

HasSize returns a boolean if a field has been set.

### GetUser

`func (o *ImagesEditRequest) GetUser() string`

GetUser returns the User field if non-nil, zero value otherwise.

### GetUserOk

`func (o *ImagesEditRequest) GetUserOk() (*string, bool)`

GetUserOk returns a tuple with the User field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUser

`func (o *ImagesEditRequest) SetUser(v string)`

SetUser sets User field to given value.

### HasUser

`func (o *ImagesEditRequest) HasUser() bool`

HasUser returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


