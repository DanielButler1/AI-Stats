# GatewayHealthResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Ok** | **bool** |  | 
**WindowMinutes** | **int32** |  | 
**Scope** | [**GatewayHealthResponseScope**](GatewayHealthResponseScope.md) |  | 
**Overall** | [**GatewayHealthResponseOverall**](GatewayHealthResponseOverall.md) |  | 
**Providers** | [**[]GatewayHealthProvider**](GatewayHealthProvider.md) |  | 
**GeneratedAt** | **int32** | Unix timestamp in milliseconds. | 

## Methods

### NewGatewayHealthResponse

`func NewGatewayHealthResponse(ok bool, windowMinutes int32, scope GatewayHealthResponseScope, overall GatewayHealthResponseOverall, providers []GatewayHealthProvider, generatedAt int32, ) *GatewayHealthResponse`

NewGatewayHealthResponse instantiates a new GatewayHealthResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayHealthResponseWithDefaults

`func NewGatewayHealthResponseWithDefaults() *GatewayHealthResponse`

NewGatewayHealthResponseWithDefaults instantiates a new GatewayHealthResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetOk

`func (o *GatewayHealthResponse) GetOk() bool`

GetOk returns the Ok field if non-nil, zero value otherwise.

### GetOkOk

`func (o *GatewayHealthResponse) GetOkOk() (*bool, bool)`

GetOkOk returns a tuple with the Ok field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOk

`func (o *GatewayHealthResponse) SetOk(v bool)`

SetOk sets Ok field to given value.


### GetWindowMinutes

`func (o *GatewayHealthResponse) GetWindowMinutes() int32`

GetWindowMinutes returns the WindowMinutes field if non-nil, zero value otherwise.

### GetWindowMinutesOk

`func (o *GatewayHealthResponse) GetWindowMinutesOk() (*int32, bool)`

GetWindowMinutesOk returns a tuple with the WindowMinutes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetWindowMinutes

`func (o *GatewayHealthResponse) SetWindowMinutes(v int32)`

SetWindowMinutes sets WindowMinutes field to given value.


### GetScope

`func (o *GatewayHealthResponse) GetScope() GatewayHealthResponseScope`

GetScope returns the Scope field if non-nil, zero value otherwise.

### GetScopeOk

`func (o *GatewayHealthResponse) GetScopeOk() (*GatewayHealthResponseScope, bool)`

GetScopeOk returns a tuple with the Scope field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScope

`func (o *GatewayHealthResponse) SetScope(v GatewayHealthResponseScope)`

SetScope sets Scope field to given value.


### GetOverall

`func (o *GatewayHealthResponse) GetOverall() GatewayHealthResponseOverall`

GetOverall returns the Overall field if non-nil, zero value otherwise.

### GetOverallOk

`func (o *GatewayHealthResponse) GetOverallOk() (*GatewayHealthResponseOverall, bool)`

GetOverallOk returns a tuple with the Overall field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOverall

`func (o *GatewayHealthResponse) SetOverall(v GatewayHealthResponseOverall)`

SetOverall sets Overall field to given value.


### GetProviders

`func (o *GatewayHealthResponse) GetProviders() []GatewayHealthProvider`

GetProviders returns the Providers field if non-nil, zero value otherwise.

### GetProvidersOk

`func (o *GatewayHealthResponse) GetProvidersOk() (*[]GatewayHealthProvider, bool)`

GetProvidersOk returns a tuple with the Providers field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviders

`func (o *GatewayHealthResponse) SetProviders(v []GatewayHealthProvider)`

SetProviders sets Providers field to given value.


### GetGeneratedAt

`func (o *GatewayHealthResponse) GetGeneratedAt() int32`

GetGeneratedAt returns the GeneratedAt field if non-nil, zero value otherwise.

### GetGeneratedAtOk

`func (o *GatewayHealthResponse) GetGeneratedAtOk() (*int32, bool)`

GetGeneratedAtOk returns a tuple with the GeneratedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGeneratedAt

`func (o *GatewayHealthResponse) SetGeneratedAt(v int32)`

SetGeneratedAt sets GeneratedAt field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


