# GatewayModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ModelId** | **string** | Canonical model identifier. | 
**Name** | **NullableString** | Human readable model name. | 
**ReleaseDate** | **NullableString** | Earliest known public release date. | 
**Status** | **NullableString** | Lifecycle status of the model (Rumoured, Announced, Available, Deprecated, Retired). | 
**OrganisationId** | **NullableString** | Organisation identifier responsible for the model. | 
**Aliases** | **[]string** | Enabled aliases that resolve to this model. | 
**Endpoints** | **[]string** | Gateway endpoints that currently route to this model. | 
**InputTypes** | **[]string** | Input content types supported by the model itself. | 
**OutputTypes** | **[]string** | Output content types supported by the model itself. | 
**Providers** | [**[]ProviderInfo**](ProviderInfo.md) | Providers that support this model with their parameters. | 

## Methods

### NewGatewayModel

`func NewGatewayModel(modelId string, name NullableString, releaseDate NullableString, status NullableString, organisationId NullableString, aliases []string, endpoints []string, inputTypes []string, outputTypes []string, providers []ProviderInfo, ) *GatewayModel`

NewGatewayModel instantiates a new GatewayModel object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayModelWithDefaults

`func NewGatewayModelWithDefaults() *GatewayModel`

NewGatewayModelWithDefaults instantiates a new GatewayModel object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModelId

`func (o *GatewayModel) GetModelId() string`

GetModelId returns the ModelId field if non-nil, zero value otherwise.

### GetModelIdOk

`func (o *GatewayModel) GetModelIdOk() (*string, bool)`

GetModelIdOk returns a tuple with the ModelId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModelId

`func (o *GatewayModel) SetModelId(v string)`

SetModelId sets ModelId field to given value.


### GetName

`func (o *GatewayModel) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *GatewayModel) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *GatewayModel) SetName(v string)`

SetName sets Name field to given value.


### SetNameNil

`func (o *GatewayModel) SetNameNil(b bool)`

 SetNameNil sets the value for Name to be an explicit nil

### UnsetName
`func (o *GatewayModel) UnsetName()`

UnsetName ensures that no value is present for Name, not even an explicit nil
### GetReleaseDate

`func (o *GatewayModel) GetReleaseDate() string`

GetReleaseDate returns the ReleaseDate field if non-nil, zero value otherwise.

### GetReleaseDateOk

`func (o *GatewayModel) GetReleaseDateOk() (*string, bool)`

GetReleaseDateOk returns a tuple with the ReleaseDate field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReleaseDate

`func (o *GatewayModel) SetReleaseDate(v string)`

SetReleaseDate sets ReleaseDate field to given value.


### SetReleaseDateNil

`func (o *GatewayModel) SetReleaseDateNil(b bool)`

 SetReleaseDateNil sets the value for ReleaseDate to be an explicit nil

### UnsetReleaseDate
`func (o *GatewayModel) UnsetReleaseDate()`

UnsetReleaseDate ensures that no value is present for ReleaseDate, not even an explicit nil
### GetStatus

`func (o *GatewayModel) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *GatewayModel) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *GatewayModel) SetStatus(v string)`

SetStatus sets Status field to given value.


### SetStatusNil

`func (o *GatewayModel) SetStatusNil(b bool)`

 SetStatusNil sets the value for Status to be an explicit nil

### UnsetStatus
`func (o *GatewayModel) UnsetStatus()`

UnsetStatus ensures that no value is present for Status, not even an explicit nil
### GetOrganisationId

`func (o *GatewayModel) GetOrganisationId() string`

GetOrganisationId returns the OrganisationId field if non-nil, zero value otherwise.

### GetOrganisationIdOk

`func (o *GatewayModel) GetOrganisationIdOk() (*string, bool)`

GetOrganisationIdOk returns a tuple with the OrganisationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOrganisationId

`func (o *GatewayModel) SetOrganisationId(v string)`

SetOrganisationId sets OrganisationId field to given value.


### SetOrganisationIdNil

`func (o *GatewayModel) SetOrganisationIdNil(b bool)`

 SetOrganisationIdNil sets the value for OrganisationId to be an explicit nil

### UnsetOrganisationId
`func (o *GatewayModel) UnsetOrganisationId()`

UnsetOrganisationId ensures that no value is present for OrganisationId, not even an explicit nil
### GetAliases

`func (o *GatewayModel) GetAliases() []string`

GetAliases returns the Aliases field if non-nil, zero value otherwise.

### GetAliasesOk

`func (o *GatewayModel) GetAliasesOk() (*[]string, bool)`

GetAliasesOk returns a tuple with the Aliases field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAliases

`func (o *GatewayModel) SetAliases(v []string)`

SetAliases sets Aliases field to given value.


### GetEndpoints

`func (o *GatewayModel) GetEndpoints() []string`

GetEndpoints returns the Endpoints field if non-nil, zero value otherwise.

### GetEndpointsOk

`func (o *GatewayModel) GetEndpointsOk() (*[]string, bool)`

GetEndpointsOk returns a tuple with the Endpoints field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEndpoints

`func (o *GatewayModel) SetEndpoints(v []string)`

SetEndpoints sets Endpoints field to given value.


### GetInputTypes

`func (o *GatewayModel) GetInputTypes() []string`

GetInputTypes returns the InputTypes field if non-nil, zero value otherwise.

### GetInputTypesOk

`func (o *GatewayModel) GetInputTypesOk() (*[]string, bool)`

GetInputTypesOk returns a tuple with the InputTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInputTypes

`func (o *GatewayModel) SetInputTypes(v []string)`

SetInputTypes sets InputTypes field to given value.


### GetOutputTypes

`func (o *GatewayModel) GetOutputTypes() []string`

GetOutputTypes returns the OutputTypes field if non-nil, zero value otherwise.

### GetOutputTypesOk

`func (o *GatewayModel) GetOutputTypesOk() (*[]string, bool)`

GetOutputTypesOk returns a tuple with the OutputTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOutputTypes

`func (o *GatewayModel) SetOutputTypes(v []string)`

SetOutputTypes sets OutputTypes field to given value.


### GetProviders

`func (o *GatewayModel) GetProviders() []ProviderInfo`

GetProviders returns the Providers field if non-nil, zero value otherwise.

### GetProvidersOk

`func (o *GatewayModel) GetProvidersOk() (*[]ProviderInfo, bool)`

GetProvidersOk returns a tuple with the Providers field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProviders

`func (o *GatewayModel) SetProviders(v []ProviderInfo)`

SetProviders sets Providers field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


