# ChatMessageAssistant

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Role** | **string** |  | 
**Content** | Pointer to [**MessageContent**](MessageContent.md) |  | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**ToolCalls** | Pointer to [**[]ToolCall**](ToolCall.md) |  | [optional] 

## Methods

### NewChatMessageAssistant

`func NewChatMessageAssistant(role string, ) *ChatMessageAssistant`

NewChatMessageAssistant instantiates a new ChatMessageAssistant object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewChatMessageAssistantWithDefaults

`func NewChatMessageAssistantWithDefaults() *ChatMessageAssistant`

NewChatMessageAssistantWithDefaults instantiates a new ChatMessageAssistant object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRole

`func (o *ChatMessageAssistant) GetRole() string`

GetRole returns the Role field if non-nil, zero value otherwise.

### GetRoleOk

`func (o *ChatMessageAssistant) GetRoleOk() (*string, bool)`

GetRoleOk returns a tuple with the Role field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRole

`func (o *ChatMessageAssistant) SetRole(v string)`

SetRole sets Role field to given value.


### GetContent

`func (o *ChatMessageAssistant) GetContent() MessageContent`

GetContent returns the Content field if non-nil, zero value otherwise.

### GetContentOk

`func (o *ChatMessageAssistant) GetContentOk() (*MessageContent, bool)`

GetContentOk returns a tuple with the Content field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContent

`func (o *ChatMessageAssistant) SetContent(v MessageContent)`

SetContent sets Content field to given value.

### HasContent

`func (o *ChatMessageAssistant) HasContent() bool`

HasContent returns a boolean if a field has been set.

### GetName

`func (o *ChatMessageAssistant) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ChatMessageAssistant) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ChatMessageAssistant) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *ChatMessageAssistant) HasName() bool`

HasName returns a boolean if a field has been set.

### GetToolCalls

`func (o *ChatMessageAssistant) GetToolCalls() []ToolCall`

GetToolCalls returns the ToolCalls field if non-nil, zero value otherwise.

### GetToolCallsOk

`func (o *ChatMessageAssistant) GetToolCallsOk() (*[]ToolCall, bool)`

GetToolCallsOk returns a tuple with the ToolCalls field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToolCalls

`func (o *ChatMessageAssistant) SetToolCalls(v []ToolCall)`

SetToolCalls sets ToolCalls field to given value.

### HasToolCalls

`func (o *ChatMessageAssistant) HasToolCalls() bool`

HasToolCalls returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


