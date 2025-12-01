# ModelListResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Ok** | **bool** |  | 
**Limit** | **int32** |  | 
**Offset** | **int32** |  | 
**Models** | [**[]GatewayModel**](GatewayModel.md) |  | 
**Total** | **int32** | Total number of models matching the filter. | 

## Methods

### NewModelListResponse

`func NewModelListResponse(ok bool, limit int32, offset int32, models []GatewayModel, total int32, ) *ModelListResponse`

NewModelListResponse instantiates a new ModelListResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewModelListResponseWithDefaults

`func NewModelListResponseWithDefaults() *ModelListResponse`

NewModelListResponseWithDefaults instantiates a new ModelListResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetOk

`func (o *ModelListResponse) GetOk() bool`

GetOk returns the Ok field if non-nil, zero value otherwise.

### GetOkOk

`func (o *ModelListResponse) GetOkOk() (*bool, bool)`

GetOkOk returns a tuple with the Ok field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOk

`func (o *ModelListResponse) SetOk(v bool)`

SetOk sets Ok field to given value.


### GetLimit

`func (o *ModelListResponse) GetLimit() int32`

GetLimit returns the Limit field if non-nil, zero value otherwise.

### GetLimitOk

`func (o *ModelListResponse) GetLimitOk() (*int32, bool)`

GetLimitOk returns a tuple with the Limit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLimit

`func (o *ModelListResponse) SetLimit(v int32)`

SetLimit sets Limit field to given value.


### GetOffset

`func (o *ModelListResponse) GetOffset() int32`

GetOffset returns the Offset field if non-nil, zero value otherwise.

### GetOffsetOk

`func (o *ModelListResponse) GetOffsetOk() (*int32, bool)`

GetOffsetOk returns a tuple with the Offset field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOffset

`func (o *ModelListResponse) SetOffset(v int32)`

SetOffset sets Offset field to given value.


### GetModels

`func (o *ModelListResponse) GetModels() []GatewayModel`

GetModels returns the Models field if non-nil, zero value otherwise.

### GetModelsOk

`func (o *ModelListResponse) GetModelsOk() (*[]GatewayModel, bool)`

GetModelsOk returns a tuple with the Models field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModels

`func (o *ModelListResponse) SetModels(v []GatewayModel)`

SetModels sets Models field to given value.


### GetTotal

`func (o *ModelListResponse) GetTotal() int32`

GetTotal returns the Total field if non-nil, zero value otherwise.

### GetTotalOk

`func (o *ModelListResponse) GetTotalOk() (*int32, bool)`

GetTotalOk returns a tuple with the Total field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTotal

`func (o *ModelListResponse) SetTotal(v int32)`

SetTotal sets Total field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


