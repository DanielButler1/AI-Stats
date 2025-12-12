# EmbeddingsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**Input** | [**EmbeddingsRequestInput**](EmbeddingsRequestInput.md) |  | 
**EncodingFormat** | Pointer to **string** |  | [optional] 
**Dimensions** | Pointer to **int32** |  | [optional] 
**User** | Pointer to **string** |  | [optional] 

## Methods

### NewEmbeddingsRequest

`func NewEmbeddingsRequest(model string, input EmbeddingsRequestInput, ) *EmbeddingsRequest`

NewEmbeddingsRequest instantiates a new EmbeddingsRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEmbeddingsRequestWithDefaults

`func NewEmbeddingsRequestWithDefaults() *EmbeddingsRequest`

NewEmbeddingsRequestWithDefaults instantiates a new EmbeddingsRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *EmbeddingsRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *EmbeddingsRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *EmbeddingsRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetInput

`func (o *EmbeddingsRequest) GetInput() EmbeddingsRequestInput`

GetInput returns the Input field if non-nil, zero value otherwise.

### GetInputOk

`func (o *EmbeddingsRequest) GetInputOk() (*EmbeddingsRequestInput, bool)`

GetInputOk returns a tuple with the Input field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInput

`func (o *EmbeddingsRequest) SetInput(v EmbeddingsRequestInput)`

SetInput sets Input field to given value.


### GetEncodingFormat

`func (o *EmbeddingsRequest) GetEncodingFormat() string`

GetEncodingFormat returns the EncodingFormat field if non-nil, zero value otherwise.

### GetEncodingFormatOk

`func (o *EmbeddingsRequest) GetEncodingFormatOk() (*string, bool)`

GetEncodingFormatOk returns a tuple with the EncodingFormat field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEncodingFormat

`func (o *EmbeddingsRequest) SetEncodingFormat(v string)`

SetEncodingFormat sets EncodingFormat field to given value.

### HasEncodingFormat

`func (o *EmbeddingsRequest) HasEncodingFormat() bool`

HasEncodingFormat returns a boolean if a field has been set.

### GetDimensions

`func (o *EmbeddingsRequest) GetDimensions() int32`

GetDimensions returns the Dimensions field if non-nil, zero value otherwise.

### GetDimensionsOk

`func (o *EmbeddingsRequest) GetDimensionsOk() (*int32, bool)`

GetDimensionsOk returns a tuple with the Dimensions field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDimensions

`func (o *EmbeddingsRequest) SetDimensions(v int32)`

SetDimensions sets Dimensions field to given value.

### HasDimensions

`func (o *EmbeddingsRequest) HasDimensions() bool`

HasDimensions returns a boolean if a field has been set.

### GetUser

`func (o *EmbeddingsRequest) GetUser() string`

GetUser returns the User field if non-nil, zero value otherwise.

### GetUserOk

`func (o *EmbeddingsRequest) GetUserOk() (*string, bool)`

GetUserOk returns a tuple with the User field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUser

`func (o *EmbeddingsRequest) SetUser(v string)`

SetUser sets User field to given value.

### HasUser

`func (o *EmbeddingsRequest) HasUser() bool`

HasUser returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


