# ImageGenerationResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**NativeResponseId** | Pointer to **string** |  | [optional] 
**Provider** | **string** |  | 
**Meta** | [**GatewayMetadata**](GatewayMetadata.md) |  | 
**Usage** | Pointer to [**GatewayUsage**](GatewayUsage.md) |  | [optional] 
**Id** | **string** |  | 
**Created** | **int32** |  | 
**Model** | **string** |  | 
**Data** | [**[]GatewayImageData**](GatewayImageData.md) |  | 

## Methods

### NewImageGenerationResponse

`func NewImageGenerationResponse(provider string, meta GatewayMetadata, id string, created int32, model string, data []GatewayImageData, ) *ImageGenerationResponse`

NewImageGenerationResponse instantiates a new ImageGenerationResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewImageGenerationResponseWithDefaults

`func NewImageGenerationResponseWithDefaults() *ImageGenerationResponse`

NewImageGenerationResponseWithDefaults instantiates a new ImageGenerationResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNativeResponseId

`func (o *ImageGenerationResponse) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *ImageGenerationResponse) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *ImageGenerationResponse) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *ImageGenerationResponse) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### GetProvider

`func (o *ImageGenerationResponse) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *ImageGenerationResponse) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *ImageGenerationResponse) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetMeta

`func (o *ImageGenerationResponse) GetMeta() GatewayMetadata`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *ImageGenerationResponse) GetMetaOk() (*GatewayMetadata, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *ImageGenerationResponse) SetMeta(v GatewayMetadata)`

SetMeta sets Meta field to given value.


### GetUsage

`func (o *ImageGenerationResponse) GetUsage() GatewayUsage`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *ImageGenerationResponse) GetUsageOk() (*GatewayUsage, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *ImageGenerationResponse) SetUsage(v GatewayUsage)`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *ImageGenerationResponse) HasUsage() bool`

HasUsage returns a boolean if a field has been set.

### GetId

`func (o *ImageGenerationResponse) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ImageGenerationResponse) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ImageGenerationResponse) SetId(v string)`

SetId sets Id field to given value.


### GetCreated

`func (o *ImageGenerationResponse) GetCreated() int32`

GetCreated returns the Created field if non-nil, zero value otherwise.

### GetCreatedOk

`func (o *ImageGenerationResponse) GetCreatedOk() (*int32, bool)`

GetCreatedOk returns a tuple with the Created field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreated

`func (o *ImageGenerationResponse) SetCreated(v int32)`

SetCreated sets Created field to given value.


### GetModel

`func (o *ImageGenerationResponse) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ImageGenerationResponse) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ImageGenerationResponse) SetModel(v string)`

SetModel sets Model field to given value.


### GetData

`func (o *ImageGenerationResponse) GetData() []GatewayImageData`

GetData returns the Data field if non-nil, zero value otherwise.

### GetDataOk

`func (o *ImageGenerationResponse) GetDataOk() (*[]GatewayImageData, bool)`

GetDataOk returns a tuple with the Data field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetData

`func (o *ImageGenerationResponse) SetData(v []GatewayImageData)`

SetData sets Data field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


