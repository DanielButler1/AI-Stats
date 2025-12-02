# ChatMessageSystem

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Role** | **string** |  | 
**Content** | [**MessageContent**](MessageContent.md) |  | 
**Name** | Pointer to **string** |  | [optional] 

## Methods

### NewChatMessageSystem

`func NewChatMessageSystem(role string, content MessageContent, ) *ChatMessageSystem`

NewChatMessageSystem instantiates a new ChatMessageSystem object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewChatMessageSystemWithDefaults

`func NewChatMessageSystemWithDefaults() *ChatMessageSystem`

NewChatMessageSystemWithDefaults instantiates a new ChatMessageSystem object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRole

`func (o *ChatMessageSystem) GetRole() string`

GetRole returns the Role field if non-nil, zero value otherwise.

### GetRoleOk

`func (o *ChatMessageSystem) GetRoleOk() (*string, bool)`

GetRoleOk returns a tuple with the Role field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRole

`func (o *ChatMessageSystem) SetRole(v string)`

SetRole sets Role field to given value.


### GetContent

`func (o *ChatMessageSystem) GetContent() MessageContent`

GetContent returns the Content field if non-nil, zero value otherwise.

### GetContentOk

`func (o *ChatMessageSystem) GetContentOk() (*MessageContent, bool)`

GetContentOk returns a tuple with the Content field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContent

`func (o *ChatMessageSystem) SetContent(v MessageContent)`

SetContent sets Content field to given value.


### GetName

`func (o *ChatMessageSystem) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ChatMessageSystem) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ChatMessageSystem) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *ChatMessageSystem) HasName() bool`

HasName returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


