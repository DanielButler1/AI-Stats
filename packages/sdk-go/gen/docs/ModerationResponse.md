# ModerationResponse

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
**Results** | [**[]ModerationResult**](ModerationResult.md) |  | 

## Methods

### NewModerationResponse

`func NewModerationResponse(provider string, meta GatewayMetadata, id string, created int32, model string, results []ModerationResult, ) *ModerationResponse`

NewModerationResponse instantiates a new ModerationResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewModerationResponseWithDefaults

`func NewModerationResponseWithDefaults() *ModerationResponse`

NewModerationResponseWithDefaults instantiates a new ModerationResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNativeResponseId

`func (o *ModerationResponse) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *ModerationResponse) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *ModerationResponse) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *ModerationResponse) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### GetProvider

`func (o *ModerationResponse) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *ModerationResponse) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *ModerationResponse) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetMeta

`func (o *ModerationResponse) GetMeta() GatewayMetadata`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *ModerationResponse) GetMetaOk() (*GatewayMetadata, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *ModerationResponse) SetMeta(v GatewayMetadata)`

SetMeta sets Meta field to given value.


### GetUsage

`func (o *ModerationResponse) GetUsage() GatewayUsage`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *ModerationResponse) GetUsageOk() (*GatewayUsage, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *ModerationResponse) SetUsage(v GatewayUsage)`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *ModerationResponse) HasUsage() bool`

HasUsage returns a boolean if a field has been set.

### GetId

`func (o *ModerationResponse) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ModerationResponse) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ModerationResponse) SetId(v string)`

SetId sets Id field to given value.


### GetCreated

`func (o *ModerationResponse) GetCreated() int32`

GetCreated returns the Created field if non-nil, zero value otherwise.

### GetCreatedOk

`func (o *ModerationResponse) GetCreatedOk() (*int32, bool)`

GetCreatedOk returns a tuple with the Created field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreated

`func (o *ModerationResponse) SetCreated(v int32)`

SetCreated sets Created field to given value.


### GetModel

`func (o *ModerationResponse) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ModerationResponse) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ModerationResponse) SetModel(v string)`

SetModel sets Model field to given value.


### GetResults

`func (o *ModerationResponse) GetResults() []ModerationResult`

GetResults returns the Results field if non-nil, zero value otherwise.

### GetResultsOk

`func (o *ModerationResponse) GetResultsOk() (*[]ModerationResult, bool)`

GetResultsOk returns a tuple with the Results field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResults

`func (o *ModerationResponse) SetResults(v []ModerationResult)`

SetResults sets Results field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


