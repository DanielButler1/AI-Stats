# VideoGenerationResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**NativeResponseId** | Pointer to **string** |  | [optional] 
**Provider** | **string** |  | 
**Meta** | [**GatewayMetadata**](GatewayMetadata.md) |  | 
**Usage** | Pointer to [**GatewayUsage**](GatewayUsage.md) |  | [optional] 

## Methods

### NewVideoGenerationResponse

`func NewVideoGenerationResponse(provider string, meta GatewayMetadata, ) *VideoGenerationResponse`

NewVideoGenerationResponse instantiates a new VideoGenerationResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewVideoGenerationResponseWithDefaults

`func NewVideoGenerationResponseWithDefaults() *VideoGenerationResponse`

NewVideoGenerationResponseWithDefaults instantiates a new VideoGenerationResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNativeResponseId

`func (o *VideoGenerationResponse) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *VideoGenerationResponse) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *VideoGenerationResponse) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *VideoGenerationResponse) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### GetProvider

`func (o *VideoGenerationResponse) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *VideoGenerationResponse) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *VideoGenerationResponse) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetMeta

`func (o *VideoGenerationResponse) GetMeta() GatewayMetadata`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *VideoGenerationResponse) GetMetaOk() (*GatewayMetadata, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *VideoGenerationResponse) SetMeta(v GatewayMetadata)`

SetMeta sets Meta field to given value.


### GetUsage

`func (o *VideoGenerationResponse) GetUsage() GatewayUsage`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *VideoGenerationResponse) GetUsageOk() (*GatewayUsage, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *VideoGenerationResponse) SetUsage(v GatewayUsage)`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *VideoGenerationResponse) HasUsage() bool`

HasUsage returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


