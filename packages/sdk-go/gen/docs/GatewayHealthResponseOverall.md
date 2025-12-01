# GatewayHealthResponseOverall

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Status** | **string** |  | 
**ProvidersUp** | **int32** |  | 
**ProvidersTotal** | **int32** |  | 
**P50Ms** | Pointer to **float32** |  | [optional] 
**P95Ms** | Pointer to **float32** |  | [optional] 
**SuccessRate** | Pointer to **float32** |  | [optional] 

## Methods

### NewGatewayHealthResponseOverall

`func NewGatewayHealthResponseOverall(status string, providersUp int32, providersTotal int32, ) *GatewayHealthResponseOverall`

NewGatewayHealthResponseOverall instantiates a new GatewayHealthResponseOverall object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayHealthResponseOverallWithDefaults

`func NewGatewayHealthResponseOverallWithDefaults() *GatewayHealthResponseOverall`

NewGatewayHealthResponseOverallWithDefaults instantiates a new GatewayHealthResponseOverall object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetStatus

`func (o *GatewayHealthResponseOverall) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *GatewayHealthResponseOverall) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *GatewayHealthResponseOverall) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetProvidersUp

`func (o *GatewayHealthResponseOverall) GetProvidersUp() int32`

GetProvidersUp returns the ProvidersUp field if non-nil, zero value otherwise.

### GetProvidersUpOk

`func (o *GatewayHealthResponseOverall) GetProvidersUpOk() (*int32, bool)`

GetProvidersUpOk returns a tuple with the ProvidersUp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvidersUp

`func (o *GatewayHealthResponseOverall) SetProvidersUp(v int32)`

SetProvidersUp sets ProvidersUp field to given value.


### GetProvidersTotal

`func (o *GatewayHealthResponseOverall) GetProvidersTotal() int32`

GetProvidersTotal returns the ProvidersTotal field if non-nil, zero value otherwise.

### GetProvidersTotalOk

`func (o *GatewayHealthResponseOverall) GetProvidersTotalOk() (*int32, bool)`

GetProvidersTotalOk returns a tuple with the ProvidersTotal field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvidersTotal

`func (o *GatewayHealthResponseOverall) SetProvidersTotal(v int32)`

SetProvidersTotal sets ProvidersTotal field to given value.


### GetP50Ms

`func (o *GatewayHealthResponseOverall) GetP50Ms() float32`

GetP50Ms returns the P50Ms field if non-nil, zero value otherwise.

### GetP50MsOk

`func (o *GatewayHealthResponseOverall) GetP50MsOk() (*float32, bool)`

GetP50MsOk returns a tuple with the P50Ms field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetP50Ms

`func (o *GatewayHealthResponseOverall) SetP50Ms(v float32)`

SetP50Ms sets P50Ms field to given value.

### HasP50Ms

`func (o *GatewayHealthResponseOverall) HasP50Ms() bool`

HasP50Ms returns a boolean if a field has been set.

### GetP95Ms

`func (o *GatewayHealthResponseOverall) GetP95Ms() float32`

GetP95Ms returns the P95Ms field if non-nil, zero value otherwise.

### GetP95MsOk

`func (o *GatewayHealthResponseOverall) GetP95MsOk() (*float32, bool)`

GetP95MsOk returns a tuple with the P95Ms field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetP95Ms

`func (o *GatewayHealthResponseOverall) SetP95Ms(v float32)`

SetP95Ms sets P95Ms field to given value.

### HasP95Ms

`func (o *GatewayHealthResponseOverall) HasP95Ms() bool`

HasP95Ms returns a boolean if a field has been set.

### GetSuccessRate

`func (o *GatewayHealthResponseOverall) GetSuccessRate() float32`

GetSuccessRate returns the SuccessRate field if non-nil, zero value otherwise.

### GetSuccessRateOk

`func (o *GatewayHealthResponseOverall) GetSuccessRateOk() (*float32, bool)`

GetSuccessRateOk returns a tuple with the SuccessRate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccessRate

`func (o *GatewayHealthResponseOverall) SetSuccessRate(v float32)`

SetSuccessRate sets SuccessRate field to given value.

### HasSuccessRate

`func (o *GatewayHealthResponseOverall) HasSuccessRate() bool`

HasSuccessRate returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


