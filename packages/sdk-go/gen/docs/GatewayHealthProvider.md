# GatewayHealthProvider

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Provider** | **string** |  | 
**Status** | **string** |  | 
**Breaker** | **string** |  | 
**P50Ms** | Pointer to **float32** |  | [optional] 
**P95Ms** | Pointer to **float32** |  | [optional] 
**SuccessRate** | **float32** |  | 
**Load** | **float32** |  | 
**LastUpdated** | **int32** | Unix timestamp (ms). | 

## Methods

### NewGatewayHealthProvider

`func NewGatewayHealthProvider(provider string, status string, breaker string, successRate float32, load float32, lastUpdated int32, ) *GatewayHealthProvider`

NewGatewayHealthProvider instantiates a new GatewayHealthProvider object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayHealthProviderWithDefaults

`func NewGatewayHealthProviderWithDefaults() *GatewayHealthProvider`

NewGatewayHealthProviderWithDefaults instantiates a new GatewayHealthProvider object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetProvider

`func (o *GatewayHealthProvider) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *GatewayHealthProvider) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *GatewayHealthProvider) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetStatus

`func (o *GatewayHealthProvider) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *GatewayHealthProvider) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *GatewayHealthProvider) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetBreaker

`func (o *GatewayHealthProvider) GetBreaker() string`

GetBreaker returns the Breaker field if non-nil, zero value otherwise.

### GetBreakerOk

`func (o *GatewayHealthProvider) GetBreakerOk() (*string, bool)`

GetBreakerOk returns a tuple with the Breaker field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBreaker

`func (o *GatewayHealthProvider) SetBreaker(v string)`

SetBreaker sets Breaker field to given value.


### GetP50Ms

`func (o *GatewayHealthProvider) GetP50Ms() float32`

GetP50Ms returns the P50Ms field if non-nil, zero value otherwise.

### GetP50MsOk

`func (o *GatewayHealthProvider) GetP50MsOk() (*float32, bool)`

GetP50MsOk returns a tuple with the P50Ms field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetP50Ms

`func (o *GatewayHealthProvider) SetP50Ms(v float32)`

SetP50Ms sets P50Ms field to given value.

### HasP50Ms

`func (o *GatewayHealthProvider) HasP50Ms() bool`

HasP50Ms returns a boolean if a field has been set.

### GetP95Ms

`func (o *GatewayHealthProvider) GetP95Ms() float32`

GetP95Ms returns the P95Ms field if non-nil, zero value otherwise.

### GetP95MsOk

`func (o *GatewayHealthProvider) GetP95MsOk() (*float32, bool)`

GetP95MsOk returns a tuple with the P95Ms field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetP95Ms

`func (o *GatewayHealthProvider) SetP95Ms(v float32)`

SetP95Ms sets P95Ms field to given value.

### HasP95Ms

`func (o *GatewayHealthProvider) HasP95Ms() bool`

HasP95Ms returns a boolean if a field has been set.

### GetSuccessRate

`func (o *GatewayHealthProvider) GetSuccessRate() float32`

GetSuccessRate returns the SuccessRate field if non-nil, zero value otherwise.

### GetSuccessRateOk

`func (o *GatewayHealthProvider) GetSuccessRateOk() (*float32, bool)`

GetSuccessRateOk returns a tuple with the SuccessRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessRate

`func (o *GatewayHealthProvider) SetSuccessRate(v float32)`

SetSuccessRate sets SuccessRate field to given value.


### GetLoad

`func (o *GatewayHealthProvider) GetLoad() float32`

GetLoad returns the Load field if non-nil, zero value otherwise.

### GetLoadOk

`func (o *GatewayHealthProvider) GetLoadOk() (*float32, bool)`

GetLoadOk returns a tuple with the Load field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLoad

`func (o *GatewayHealthProvider) SetLoad(v float32)`

SetLoad sets Load field to given value.


### GetLastUpdated

`func (o *GatewayHealthProvider) GetLastUpdated() int32`

GetLastUpdated returns the LastUpdated field if non-nil, zero value otherwise.

### GetLastUpdatedOk

`func (o *GatewayHealthProvider) GetLastUpdatedOk() (*int32, bool)`

GetLastUpdatedOk returns a tuple with the LastUpdated field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastUpdated

`func (o *GatewayHealthProvider) SetLastUpdated(v int32)`

SetLastUpdated sets LastUpdated field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


