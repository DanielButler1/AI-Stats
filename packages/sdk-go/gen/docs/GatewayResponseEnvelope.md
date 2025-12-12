# GatewayResponseEnvelope

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**NativeResponseId** | Pointer to **NullableString** |  | [optional] 
**Provider** | **string** |  | 
**Meta** | [**GatewayMetadata**](GatewayMetadata.md) |  | 
**Usage** | Pointer to [**GatewayUsage**](GatewayUsage.md) |  | [optional] 

## Methods

### NewGatewayResponseEnvelope

`func NewGatewayResponseEnvelope(provider string, meta GatewayMetadata, ) *GatewayResponseEnvelope`

NewGatewayResponseEnvelope instantiates a new GatewayResponseEnvelope object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayResponseEnvelopeWithDefaults

`func NewGatewayResponseEnvelopeWithDefaults() *GatewayResponseEnvelope`

NewGatewayResponseEnvelopeWithDefaults instantiates a new GatewayResponseEnvelope object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNativeResponseId

`func (o *GatewayResponseEnvelope) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *GatewayResponseEnvelope) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *GatewayResponseEnvelope) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *GatewayResponseEnvelope) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### SetNativeResponseIdNil

`func (o *GatewayResponseEnvelope) SetNativeResponseIdNil(b bool)`

 SetNativeResponseIdNil sets the value for NativeResponseId to be an explicit nil

### UnsetNativeResponseId
`func (o *GatewayResponseEnvelope) UnsetNativeResponseId()`

UnsetNativeResponseId ensures that no value is present for NativeResponseId, not even an explicit nil
### GetProvider

`func (o *GatewayResponseEnvelope) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *GatewayResponseEnvelope) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *GatewayResponseEnvelope) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetMeta

`func (o *GatewayResponseEnvelope) GetMeta() GatewayMetadata`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *GatewayResponseEnvelope) GetMetaOk() (*GatewayMetadata, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *GatewayResponseEnvelope) SetMeta(v GatewayMetadata)`

SetMeta sets Meta field to given value.


### GetUsage

`func (o *GatewayResponseEnvelope) GetUsage() GatewayUsage`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *GatewayResponseEnvelope) GetUsageOk() (*GatewayUsage, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *GatewayResponseEnvelope) SetUsage(v GatewayUsage)`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *GatewayResponseEnvelope) HasUsage() bool`

HasUsage returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


