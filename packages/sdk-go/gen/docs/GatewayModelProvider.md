# GatewayModelProvider

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ApiProviderId** | **string** | Identifier for the provider. | 
**ApiProviderName** | **NullableString** | Human readable provider name. | 
**Link** | **NullableString** | Canonical URL for the provider. | 
**CountryCode** | **NullableString** | Provider headquarters country code. | 
**Endpoint** | **string** | Gateway endpoint served by this provider. | 
**ProviderModelSlug** | **NullableString** | Provider specific model identifier. | 
**IsActiveGateway** | **bool** | Whether the provider is currently routable via the gateway. | 
**InputModalities** | **[]string** | Input modalities supported by this provider-model pairing. | 
**OutputModalities** | **[]string** | Output modalities supported by this provider-model pairing. | 
**EffectiveFrom** | **NullableTime** | Timestamp from which the pairing is effective. | 
**EffectiveTo** | **NullableTime** | Timestamp when the pairing stops being effective. | 

## Methods

### NewGatewayModelProvider

`func NewGatewayModelProvider(apiProviderId string, apiProviderName NullableString, link NullableString, countryCode NullableString, endpoint string, providerModelSlug NullableString, isActiveGateway bool, inputModalities []string, outputModalities []string, effectiveFrom NullableTime, effectiveTo NullableTime, ) *GatewayModelProvider`

NewGatewayModelProvider instantiates a new GatewayModelProvider object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayModelProviderWithDefaults

`func NewGatewayModelProviderWithDefaults() *GatewayModelProvider`

NewGatewayModelProviderWithDefaults instantiates a new GatewayModelProvider object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetApiProviderId

`func (o *GatewayModelProvider) GetApiProviderId() string`

GetApiProviderId returns the ApiProviderId field if non-nil, zero value otherwise.

### GetApiProviderIdOk

`func (o *GatewayModelProvider) GetApiProviderIdOk() (*string, bool)`

GetApiProviderIdOk returns a tuple with the ApiProviderId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApiProviderId

`func (o *GatewayModelProvider) SetApiProviderId(v string)`

SetApiProviderId sets ApiProviderId field to given value.


### GetApiProviderName

`func (o *GatewayModelProvider) GetApiProviderName() string`

GetApiProviderName returns the ApiProviderName field if non-nil, zero value otherwise.

### GetApiProviderNameOk

`func (o *GatewayModelProvider) GetApiProviderNameOk() (*string, bool)`

GetApiProviderNameOk returns a tuple with the ApiProviderName field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApiProviderName

`func (o *GatewayModelProvider) SetApiProviderName(v string)`

SetApiProviderName sets ApiProviderName field to given value.


### SetApiProviderNameNil

`func (o *GatewayModelProvider) SetApiProviderNameNil(b bool)`

 SetApiProviderNameNil sets the value for ApiProviderName to be an explicit nil

### UnsetApiProviderName
`func (o *GatewayModelProvider) UnsetApiProviderName()`

UnsetApiProviderName ensures that no value is present for ApiProviderName, not even an explicit nil
### GetLink

`func (o *GatewayModelProvider) GetLink() string`

GetLink returns the Link field if non-nil, zero value otherwise.

### GetLinkOk

`func (o *GatewayModelProvider) GetLinkOk() (*string, bool)`

GetLinkOk returns a tuple with the Link field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLink

`func (o *GatewayModelProvider) SetLink(v string)`

SetLink sets Link field to given value.


### SetLinkNil

`func (o *GatewayModelProvider) SetLinkNil(b bool)`

 SetLinkNil sets the value for Link to be an explicit nil

### UnsetLink
`func (o *GatewayModelProvider) UnsetLink()`

UnsetLink ensures that no value is present for Link, not even an explicit nil
### GetCountryCode

`func (o *GatewayModelProvider) GetCountryCode() string`

GetCountryCode returns the CountryCode field if non-nil, zero value otherwise.

### GetCountryCodeOk

`func (o *GatewayModelProvider) GetCountryCodeOk() (*string, bool)`

GetCountryCodeOk returns a tuple with the CountryCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountryCode

`func (o *GatewayModelProvider) SetCountryCode(v string)`

SetCountryCode sets CountryCode field to given value.


### SetCountryCodeNil

`func (o *GatewayModelProvider) SetCountryCodeNil(b bool)`

 SetCountryCodeNil sets the value for CountryCode to be an explicit nil

### UnsetCountryCode
`func (o *GatewayModelProvider) UnsetCountryCode()`

UnsetCountryCode ensures that no value is present for CountryCode, not even an explicit nil
### GetEndpoint

`func (o *GatewayModelProvider) GetEndpoint() string`

GetEndpoint returns the Endpoint field if non-nil, zero value otherwise.

### GetEndpointOk

`func (o *GatewayModelProvider) GetEndpointOk() (*string, bool)`

GetEndpointOk returns a tuple with the Endpoint field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEndpoint

`func (o *GatewayModelProvider) SetEndpoint(v string)`

SetEndpoint sets Endpoint field to given value.


### GetProviderModelSlug

`func (o *GatewayModelProvider) GetProviderModelSlug() string`

GetProviderModelSlug returns the ProviderModelSlug field if non-nil, zero value otherwise.

### GetProviderModelSlugOk

`func (o *GatewayModelProvider) GetProviderModelSlugOk() (*string, bool)`

GetProviderModelSlugOk returns a tuple with the ProviderModelSlug field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviderModelSlug

`func (o *GatewayModelProvider) SetProviderModelSlug(v string)`

SetProviderModelSlug sets ProviderModelSlug field to given value.


### SetProviderModelSlugNil

`func (o *GatewayModelProvider) SetProviderModelSlugNil(b bool)`

 SetProviderModelSlugNil sets the value for ProviderModelSlug to be an explicit nil

### UnsetProviderModelSlug
`func (o *GatewayModelProvider) UnsetProviderModelSlug()`

UnsetProviderModelSlug ensures that no value is present for ProviderModelSlug, not even an explicit nil
### GetIsActiveGateway

`func (o *GatewayModelProvider) GetIsActiveGateway() bool`

GetIsActiveGateway returns the IsActiveGateway field if non-nil, zero value otherwise.

### GetIsActiveGatewayOk

`func (o *GatewayModelProvider) GetIsActiveGatewayOk() (*bool, bool)`

GetIsActiveGatewayOk returns a tuple with the IsActiveGateway field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsActiveGateway

`func (o *GatewayModelProvider) SetIsActiveGateway(v bool)`

SetIsActiveGateway sets IsActiveGateway field to given value.


### GetInputModalities

`func (o *GatewayModelProvider) GetInputModalities() []string`

GetInputModalities returns the InputModalities field if non-nil, zero value otherwise.

### GetInputModalitiesOk

`func (o *GatewayModelProvider) GetInputModalitiesOk() (*[]string, bool)`

GetInputModalitiesOk returns a tuple with the InputModalities field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInputModalities

`func (o *GatewayModelProvider) SetInputModalities(v []string)`

SetInputModalities sets InputModalities field to given value.


### GetOutputModalities

`func (o *GatewayModelProvider) GetOutputModalities() []string`

GetOutputModalities returns the OutputModalities field if non-nil, zero value otherwise.

### GetOutputModalitiesOk

`func (o *GatewayModelProvider) GetOutputModalitiesOk() (*[]string, bool)`

GetOutputModalitiesOk returns a tuple with the OutputModalities field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOutputModalities

`func (o *GatewayModelProvider) SetOutputModalities(v []string)`

SetOutputModalities sets OutputModalities field to given value.


### GetEffectiveFrom

`func (o *GatewayModelProvider) GetEffectiveFrom() time.Time`

GetEffectiveFrom returns the EffectiveFrom field if non-nil, zero value otherwise.

### GetEffectiveFromOk

`func (o *GatewayModelProvider) GetEffectiveFromOk() (*time.Time, bool)`

GetEffectiveFromOk returns a tuple with the EffectiveFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEffectiveFrom

`func (o *GatewayModelProvider) SetEffectiveFrom(v time.Time)`

SetEffectiveFrom sets EffectiveFrom field to given value.


### SetEffectiveFromNil

`func (o *GatewayModelProvider) SetEffectiveFromNil(b bool)`

 SetEffectiveFromNil sets the value for EffectiveFrom to be an explicit nil

### UnsetEffectiveFrom
`func (o *GatewayModelProvider) UnsetEffectiveFrom()`

UnsetEffectiveFrom ensures that no value is present for EffectiveFrom, not even an explicit nil
### GetEffectiveTo

`func (o *GatewayModelProvider) GetEffectiveTo() time.Time`

GetEffectiveTo returns the EffectiveTo field if non-nil, zero value otherwise.

### GetEffectiveToOk

`func (o *GatewayModelProvider) GetEffectiveToOk() (*time.Time, bool)`

GetEffectiveToOk returns a tuple with the EffectiveTo field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEffectiveTo

`func (o *GatewayModelProvider) SetEffectiveTo(v time.Time)`

SetEffectiveTo sets EffectiveTo field to given value.


### SetEffectiveToNil

`func (o *GatewayModelProvider) SetEffectiveToNil(b bool)`

 SetEffectiveToNil sets the value for EffectiveTo to be an explicit nil

### UnsetEffectiveTo
`func (o *GatewayModelProvider) UnsetEffectiveTo()`

UnsetEffectiveTo ensures that no value is present for EffectiveTo, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


