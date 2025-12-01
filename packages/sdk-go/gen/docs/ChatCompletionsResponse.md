# ChatCompletionsResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**NativeResponseId** | Pointer to **string** |  | [optional] 
**Provider** | **string** |  | 
**Meta** | [**GatewayMetadata**](GatewayMetadata.md) |  | 
**Usage** | Pointer to [**GatewayUsage**](GatewayUsage.md) |  | [optional] 
**Created** | **int32** | Unix timestamp in seconds. | 
**Model** | **string** |  | 
**Choices** | [**[]GatewayChatChoice**](GatewayChatChoice.md) |  | 

## Methods

### NewChatCompletionsResponse

`func NewChatCompletionsResponse(provider string, meta GatewayMetadata, created int32, model string, choices []GatewayChatChoice, ) *ChatCompletionsResponse`

NewChatCompletionsResponse instantiates a new ChatCompletionsResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewChatCompletionsResponseWithDefaults

`func NewChatCompletionsResponseWithDefaults() *ChatCompletionsResponse`

NewChatCompletionsResponseWithDefaults instantiates a new ChatCompletionsResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetNativeResponseId

`func (o *ChatCompletionsResponse) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *ChatCompletionsResponse) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *ChatCompletionsResponse) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *ChatCompletionsResponse) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### GetProvider

`func (o *ChatCompletionsResponse) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *ChatCompletionsResponse) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *ChatCompletionsResponse) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetMeta

`func (o *ChatCompletionsResponse) GetMeta() GatewayMetadata`

GetMeta returns the Meta field if non-nil, zero value otherwise.

### GetMetaOk

`func (o *ChatCompletionsResponse) GetMetaOk() (*GatewayMetadata, bool)`

GetMetaOk returns a tuple with the Meta field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMeta

`func (o *ChatCompletionsResponse) SetMeta(v GatewayMetadata)`

SetMeta sets Meta field to given value.


### GetUsage

`func (o *ChatCompletionsResponse) GetUsage() GatewayUsage`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *ChatCompletionsResponse) GetUsageOk() (*GatewayUsage, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *ChatCompletionsResponse) SetUsage(v GatewayUsage)`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *ChatCompletionsResponse) HasUsage() bool`

HasUsage returns a boolean if a field has been set.

### GetCreated

`func (o *ChatCompletionsResponse) GetCreated() int32`

GetCreated returns the Created field if non-nil, zero value otherwise.

### GetCreatedOk

`func (o *ChatCompletionsResponse) GetCreatedOk() (*int32, bool)`

GetCreatedOk returns a tuple with the Created field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreated

`func (o *ChatCompletionsResponse) SetCreated(v int32)`

SetCreated sets Created field to given value.


### GetModel

`func (o *ChatCompletionsResponse) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *ChatCompletionsResponse) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *ChatCompletionsResponse) SetModel(v string)`

SetModel sets Model field to given value.


### GetChoices

`func (o *ChatCompletionsResponse) GetChoices() []GatewayChatChoice`

GetChoices returns the Choices field if non-nil, zero value otherwise.

### GetChoicesOk

`func (o *ChatCompletionsResponse) GetChoicesOk() (*[]GatewayChatChoice, bool)`

GetChoicesOk returns a tuple with the Choices field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetChoices

`func (o *ChatCompletionsResponse) SetChoices(v []GatewayChatChoice)`

SetChoices sets Choices field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


