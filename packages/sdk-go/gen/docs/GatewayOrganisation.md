# GatewayOrganisation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**OrganisationId** | [**NullableOrganisationId**](OrganisationId.md) |  | 
**Name** | **NullableString** | Display name for the organisation. | 
**CountryCode** | **NullableString** | ISO 3166-1 alpha-2 country code. | 

## Methods

### NewGatewayOrganisation

`func NewGatewayOrganisation(organisationId NullableOrganisationId, name NullableString, countryCode NullableString, ) *GatewayOrganisation`

NewGatewayOrganisation instantiates a new GatewayOrganisation object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayOrganisationWithDefaults

`func NewGatewayOrganisationWithDefaults() *GatewayOrganisation`

NewGatewayOrganisationWithDefaults instantiates a new GatewayOrganisation object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetOrganisationId

`func (o *GatewayOrganisation) GetOrganisationId() OrganisationId`

GetOrganisationId returns the OrganisationId field if non-nil, zero value otherwise.

### GetOrganisationIdOk

`func (o *GatewayOrganisation) GetOrganisationIdOk() (*OrganisationId, bool)`

GetOrganisationIdOk returns a tuple with the OrganisationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganisationId

`func (o *GatewayOrganisation) SetOrganisationId(v OrganisationId)`

SetOrganisationId sets OrganisationId field to given value.


### SetOrganisationIdNil

`func (o *GatewayOrganisation) SetOrganisationIdNil(b bool)`

 SetOrganisationIdNil sets the value for OrganisationId to be an explicit nil

### UnsetOrganisationId
`func (o *GatewayOrganisation) UnsetOrganisationId()`

UnsetOrganisationId ensures that no value is present for OrganisationId, not even an explicit nil
### GetName

`func (o *GatewayOrganisation) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *GatewayOrganisation) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *GatewayOrganisation) SetName(v string)`

SetName sets Name field to given value.


### SetNameNil

`func (o *GatewayOrganisation) SetNameNil(b bool)`

 SetNameNil sets the value for Name to be an explicit nil

### UnsetName
`func (o *GatewayOrganisation) UnsetName()`

UnsetName ensures that no value is present for Name, not even an explicit nil
### GetCountryCode

`func (o *GatewayOrganisation) GetCountryCode() string`

GetCountryCode returns the CountryCode field if non-nil, zero value otherwise.

### GetCountryCodeOk

`func (o *GatewayOrganisation) GetCountryCodeOk() (*string, bool)`

GetCountryCodeOk returns a tuple with the CountryCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountryCode

`func (o *GatewayOrganisation) SetCountryCode(v string)`

SetCountryCode sets CountryCode field to given value.


### SetCountryCodeNil

`func (o *GatewayOrganisation) SetCountryCodeNil(b bool)`

 SetCountryCodeNil sets the value for CountryCode to be an explicit nil

### UnsetCountryCode
`func (o *GatewayOrganisation) UnsetCountryCode()`

UnsetCountryCode ensures that no value is present for CountryCode, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


