# ProviderInfo

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ApiProviderId** | **string** | Provider identifier. | 
**Params** | **[]string** | Supported parameters for this provider. | 

## Methods

### NewProviderInfo

`func NewProviderInfo(apiProviderId string, params []string, ) *ProviderInfo`

NewProviderInfo instantiates a new ProviderInfo object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProviderInfoWithDefaults

`func NewProviderInfoWithDefaults() *ProviderInfo`

NewProviderInfoWithDefaults instantiates a new ProviderInfo object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetApiProviderId

`func (o *ProviderInfo) GetApiProviderId() string`

GetApiProviderId returns the ApiProviderId field if non-nil, zero value otherwise.

### GetApiProviderIdOk

`func (o *ProviderInfo) GetApiProviderIdOk() (*string, bool)`

GetApiProviderIdOk returns a tuple with the ApiProviderId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApiProviderId

`func (o *ProviderInfo) SetApiProviderId(v string)`

SetApiProviderId sets ApiProviderId field to given value.


### GetParams

`func (o *ProviderInfo) GetParams() []string`

GetParams returns the Params field if non-nil, zero value otherwise.

### GetParamsOk

`func (o *ProviderInfo) GetParamsOk() (*[]string, bool)`

GetParamsOk returns a tuple with the Params field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetParams

`func (o *ProviderInfo) SetParams(v []string)`

SetParams sets Params field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


