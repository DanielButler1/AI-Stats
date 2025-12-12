# GatewayMetadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RequestId** | **string** |  | 
**Provider** | **string** |  | 
**Endpoint** | **string** |  | 
**Model** | [**ModelId**](ModelId.md) |  | 
**AppTitle** | Pointer to **NullableString** |  | [optional] 
**Referer** | Pointer to **NullableString** |  | [optional] 
**Timing** | Pointer to **map[string]interface{}** | Optional timing information captured during the request lifecycle. | [optional] 

## Methods

### NewGatewayMetadata

`func NewGatewayMetadata(requestId string, provider string, endpoint string, model ModelId, ) *GatewayMetadata`

NewGatewayMetadata instantiates a new GatewayMetadata object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayMetadataWithDefaults

`func NewGatewayMetadataWithDefaults() *GatewayMetadata`

NewGatewayMetadataWithDefaults instantiates a new GatewayMetadata object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRequestId

`func (o *GatewayMetadata) GetRequestId() string`

GetRequestId returns the RequestId field if non-nil, zero value otherwise.

### GetRequestIdOk

`func (o *GatewayMetadata) GetRequestIdOk() (*string, bool)`

GetRequestIdOk returns a tuple with the RequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestId

`func (o *GatewayMetadata) SetRequestId(v string)`

SetRequestId sets RequestId field to given value.


### GetProvider

`func (o *GatewayMetadata) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *GatewayMetadata) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *GatewayMetadata) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetEndpoint

`func (o *GatewayMetadata) GetEndpoint() string`

GetEndpoint returns the Endpoint field if non-nil, zero value otherwise.

### GetEndpointOk

`func (o *GatewayMetadata) GetEndpointOk() (*string, bool)`

GetEndpointOk returns a tuple with the Endpoint field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEndpoint

`func (o *GatewayMetadata) SetEndpoint(v string)`

SetEndpoint sets Endpoint field to given value.


### GetModel

`func (o *GatewayMetadata) GetModel() ModelId`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *GatewayMetadata) GetModelOk() (*ModelId, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *GatewayMetadata) SetModel(v ModelId)`

SetModel sets Model field to given value.


### GetAppTitle

`func (o *GatewayMetadata) GetAppTitle() string`

GetAppTitle returns the AppTitle field if non-nil, zero value otherwise.

### GetAppTitleOk

`func (o *GatewayMetadata) GetAppTitleOk() (*string, bool)`

GetAppTitleOk returns a tuple with the AppTitle field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppTitle

`func (o *GatewayMetadata) SetAppTitle(v string)`

SetAppTitle sets AppTitle field to given value.

### HasAppTitle

`func (o *GatewayMetadata) HasAppTitle() bool`

HasAppTitle returns a boolean if a field has been set.

### SetAppTitleNil

`func (o *GatewayMetadata) SetAppTitleNil(b bool)`

 SetAppTitleNil sets the value for AppTitle to be an explicit nil

### UnsetAppTitle
`func (o *GatewayMetadata) UnsetAppTitle()`

UnsetAppTitle ensures that no value is present for AppTitle, not even an explicit nil
### GetReferer

`func (o *GatewayMetadata) GetReferer() string`

GetReferer returns the Referer field if non-nil, zero value otherwise.

### GetRefererOk

`func (o *GatewayMetadata) GetRefererOk() (*string, bool)`

GetRefererOk returns a tuple with the Referer field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReferer

`func (o *GatewayMetadata) SetReferer(v string)`

SetReferer sets Referer field to given value.

### HasReferer

`func (o *GatewayMetadata) HasReferer() bool`

HasReferer returns a boolean if a field has been set.

### SetRefererNil

`func (o *GatewayMetadata) SetRefererNil(b bool)`

 SetRefererNil sets the value for Referer to be an explicit nil

### UnsetReferer
`func (o *GatewayMetadata) UnsetReferer()`

UnsetReferer ensures that no value is present for Referer, not even an explicit nil
### GetTiming

`func (o *GatewayMetadata) GetTiming() map[string]interface{}`

GetTiming returns the Timing field if non-nil, zero value otherwise.

### GetTimingOk

`func (o *GatewayMetadata) GetTimingOk() (*map[string]interface{}, bool)`

GetTimingOk returns a tuple with the Timing field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTiming

`func (o *GatewayMetadata) SetTiming(v map[string]interface{})`

SetTiming sets Timing field to given value.

### HasTiming

`func (o *GatewayMetadata) HasTiming() bool`

HasTiming returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


