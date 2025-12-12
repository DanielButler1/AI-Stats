# AudioTranslationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**AudioUrl** | Pointer to **string** |  | [optional] 
**AudioB64** | Pointer to **string** |  | [optional] 
**Language** | Pointer to **string** |  | [optional] 
**Prompt** | Pointer to **string** |  | [optional] 
**Temperature** | Pointer to **float32** |  | [optional] 

## Methods

### NewAudioTranslationRequest

`func NewAudioTranslationRequest(model string, ) *AudioTranslationRequest`

NewAudioTranslationRequest instantiates a new AudioTranslationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAudioTranslationRequestWithDefaults

`func NewAudioTranslationRequestWithDefaults() *AudioTranslationRequest`

NewAudioTranslationRequestWithDefaults instantiates a new AudioTranslationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *AudioTranslationRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *AudioTranslationRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *AudioTranslationRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetAudioUrl

`func (o *AudioTranslationRequest) GetAudioUrl() string`

GetAudioUrl returns the AudioUrl field if non-nil, zero value otherwise.

### GetAudioUrlOk

`func (o *AudioTranslationRequest) GetAudioUrlOk() (*string, bool)`

GetAudioUrlOk returns a tuple with the AudioUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAudioUrl

`func (o *AudioTranslationRequest) SetAudioUrl(v string)`

SetAudioUrl sets AudioUrl field to given value.

### HasAudioUrl

`func (o *AudioTranslationRequest) HasAudioUrl() bool`

HasAudioUrl returns a boolean if a field has been set.

### GetAudioB64

`func (o *AudioTranslationRequest) GetAudioB64() string`

GetAudioB64 returns the AudioB64 field if non-nil, zero value otherwise.

### GetAudioB64Ok

`func (o *AudioTranslationRequest) GetAudioB64Ok() (*string, bool)`

GetAudioB64Ok returns a tuple with the AudioB64 field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAudioB64

`func (o *AudioTranslationRequest) SetAudioB64(v string)`

SetAudioB64 sets AudioB64 field to given value.

### HasAudioB64

`func (o *AudioTranslationRequest) HasAudioB64() bool`

HasAudioB64 returns a boolean if a field has been set.

### GetLanguage

`func (o *AudioTranslationRequest) GetLanguage() string`

GetLanguage returns the Language field if non-nil, zero value otherwise.

### GetLanguageOk

`func (o *AudioTranslationRequest) GetLanguageOk() (*string, bool)`

GetLanguageOk returns a tuple with the Language field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLanguage

`func (o *AudioTranslationRequest) SetLanguage(v string)`

SetLanguage sets Language field to given value.

### HasLanguage

`func (o *AudioTranslationRequest) HasLanguage() bool`

HasLanguage returns a boolean if a field has been set.

### GetPrompt

`func (o *AudioTranslationRequest) GetPrompt() string`

GetPrompt returns the Prompt field if non-nil, zero value otherwise.

### GetPromptOk

`func (o *AudioTranslationRequest) GetPromptOk() (*string, bool)`

GetPromptOk returns a tuple with the Prompt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPrompt

`func (o *AudioTranslationRequest) SetPrompt(v string)`

SetPrompt sets Prompt field to given value.

### HasPrompt

`func (o *AudioTranslationRequest) HasPrompt() bool`

HasPrompt returns a boolean if a field has been set.

### GetTemperature

`func (o *AudioTranslationRequest) GetTemperature() float32`

GetTemperature returns the Temperature field if non-nil, zero value otherwise.

### GetTemperatureOk

`func (o *AudioTranslationRequest) GetTemperatureOk() (*float32, bool)`

GetTemperatureOk returns a tuple with the Temperature field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTemperature

`func (o *AudioTranslationRequest) SetTemperature(v float32)`

SetTemperature sets Temperature field to given value.

### HasTemperature

`func (o *AudioTranslationRequest) HasTemperature() bool`

HasTemperature returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


