# ChatMessageTool

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Role** | **string** |  | 
**Content** | [**MessageContent**](MessageContent.md) |  | 
**Name** | Pointer to **string** |  | [optional] 
**ToolCallId** | **string** |  | 

## Methods

### NewChatMessageTool

`func NewChatMessageTool(role string, content MessageContent, toolCallId string, ) *ChatMessageTool`

NewChatMessageTool instantiates a new ChatMessageTool object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewChatMessageToolWithDefaults

`func NewChatMessageToolWithDefaults() *ChatMessageTool`

NewChatMessageToolWithDefaults instantiates a new ChatMessageTool object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRole

`func (o *ChatMessageTool) GetRole() string`

GetRole returns the Role field if non-nil, zero value otherwise.

### GetRoleOk

`func (o *ChatMessageTool) GetRoleOk() (*string, bool)`

GetRoleOk returns a tuple with the Role field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRole

`func (o *ChatMessageTool) SetRole(v string)`

SetRole sets Role field to given value.


### GetContent

`func (o *ChatMessageTool) GetContent() MessageContent`

GetContent returns the Content field if non-nil, zero value otherwise.

### GetContentOk

`func (o *ChatMessageTool) GetContentOk() (*MessageContent, bool)`

GetContentOk returns a tuple with the Content field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContent

`func (o *ChatMessageTool) SetContent(v MessageContent)`

SetContent sets Content field to given value.


### GetName

`func (o *ChatMessageTool) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ChatMessageTool) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ChatMessageTool) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *ChatMessageTool) HasName() bool`

HasName returns a boolean if a field has been set.

### GetToolCallId

`func (o *ChatMessageTool) GetToolCallId() string`

GetToolCallId returns the ToolCallId field if non-nil, zero value otherwise.

### GetToolCallIdOk

`func (o *ChatMessageTool) GetToolCallIdOk() (*string, bool)`

GetToolCallIdOk returns a tuple with the ToolCallId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToolCallId

`func (o *ChatMessageTool) SetToolCallId(v string)`

SetToolCallId sets ToolCallId field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


