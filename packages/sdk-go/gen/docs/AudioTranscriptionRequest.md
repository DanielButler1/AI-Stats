# AudioTranscriptionRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Model** | **string** |  | 
**AudioUrl** | Pointer to **string** |  | [optional] 
**AudioB64** | Pointer to **string** |  | [optional] 
**Language** | Pointer to **string** |  | [optional] 

## Methods

### NewAudioTranscriptionRequest

`func NewAudioTranscriptionRequest(model string, ) *AudioTranscriptionRequest`

NewAudioTranscriptionRequest instantiates a new AudioTranscriptionRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAudioTranscriptionRequestWithDefaults

`func NewAudioTranscriptionRequestWithDefaults() *AudioTranscriptionRequest`

NewAudioTranscriptionRequestWithDefaults instantiates a new AudioTranscriptionRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetModel

`func (o *AudioTranscriptionRequest) GetModel() string`

GetModel returns the Model field if non-nil, zero value otherwise.

### GetModelOk

`func (o *AudioTranscriptionRequest) GetModelOk() (*string, bool)`

GetModelOk returns a tuple with the Model field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModel

`func (o *AudioTranscriptionRequest) SetModel(v string)`

SetModel sets Model field to given value.


### GetAudioUrl

`func (o *AudioTranscriptionRequest) GetAudioUrl() string`

GetAudioUrl returns the AudioUrl field if non-nil, zero value otherwise.

### GetAudioUrlOk

`func (o *AudioTranscriptionRequest) GetAudioUrlOk() (*string, bool)`

GetAudioUrlOk returns a tuple with the AudioUrl field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAudioUrl

`func (o *AudioTranscriptionRequest) SetAudioUrl(v string)`

SetAudioUrl sets AudioUrl field to given value.

### HasAudioUrl

`func (o *AudioTranscriptionRequest) HasAudioUrl() bool`

HasAudioUrl returns a boolean if a field has been set.

### GetAudioB64

`func (o *AudioTranscriptionRequest) GetAudioB64() string`

GetAudioB64 returns the AudioB64 field if non-nil, zero value otherwise.

### GetAudioB64Ok

`func (o *AudioTranscriptionRequest) GetAudioB64Ok() (*string, bool)`

GetAudioB64Ok returns a tuple with the AudioB64 field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAudioB64

`func (o *AudioTranscriptionRequest) SetAudioB64(v string)`

SetAudioB64 sets AudioB64 field to given value.

### HasAudioB64

`func (o *AudioTranscriptionRequest) HasAudioB64() bool`

HasAudioB64 returns a boolean if a field has been set.

### GetLanguage

`func (o *AudioTranscriptionRequest) GetLanguage() string`

GetLanguage returns the Language field if non-nil, zero value otherwise.

### GetLanguageOk

`func (o *AudioTranscriptionRequest) GetLanguageOk() (*string, bool)`

GetLanguageOk returns a tuple with the Language field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLanguage

`func (o *AudioTranscriptionRequest) SetLanguage(v string)`

SetLanguage sets Language field to given value.

### HasLanguage

`func (o *AudioTranscriptionRequest) HasLanguage() bool`

HasLanguage returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


