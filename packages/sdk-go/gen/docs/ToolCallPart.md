# ToolCallPart

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Type** | **string** |  | 
**Id** | **string** |  | 
**Function** | [**ToolCallFunction**](ToolCallFunction.md) |  | 

## Methods

### NewToolCallPart

`func NewToolCallPart(type_ string, id string, function ToolCallFunction, ) *ToolCallPart`

NewToolCallPart instantiates a new ToolCallPart object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewToolCallPartWithDefaults

`func NewToolCallPartWithDefaults() *ToolCallPart`

NewToolCallPartWithDefaults instantiates a new ToolCallPart object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetType

`func (o *ToolCallPart) GetType() string`

GetType returns the Type field if non-nil, zero value otherwise.

### GetTypeOk

`func (o *ToolCallPart) GetTypeOk() (*string, bool)`

GetTypeOk returns a tuple with the Type field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetType

`func (o *ToolCallPart) SetType(v string)`

SetType sets Type field to given value.


### GetId

`func (o *ToolCallPart) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ToolCallPart) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ToolCallPart) SetId(v string)`

SetId sets Id field to given value.


### GetFunction

`func (o *ToolCallPart) GetFunction() ToolCallFunction`

GetFunction returns the Function field if non-nil, zero value otherwise.

### GetFunctionOk

`func (o *ToolCallPart) GetFunctionOk() (*ToolCallFunction, bool)`

GetFunctionOk returns a tuple with the Function field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFunction

`func (o *ToolCallPart) SetFunction(v ToolCallFunction)`

SetFunction sets Function field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


