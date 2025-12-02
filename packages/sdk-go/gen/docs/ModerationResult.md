# ModerationResult

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Index** | **int32** |  | 
**Flagged** | **bool** |  | 
**Categories** | **map[string]bool** |  | 
**Scores** | **map[string]float32** |  | 
**AppliedInputTypes** | Pointer to **map[string][]string** |  | [optional] 

## Methods

### NewModerationResult

`func NewModerationResult(index int32, flagged bool, categories map[string]bool, scores map[string]float32, ) *ModerationResult`

NewModerationResult instantiates a new ModerationResult object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewModerationResultWithDefaults

`func NewModerationResultWithDefaults() *ModerationResult`

NewModerationResultWithDefaults instantiates a new ModerationResult object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetIndex

`func (o *ModerationResult) GetIndex() int32`

GetIndex returns the Index field if non-nil, zero value otherwise.

### GetIndexOk

`func (o *ModerationResult) GetIndexOk() (*int32, bool)`

GetIndexOk returns a tuple with the Index field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIndex

`func (o *ModerationResult) SetIndex(v int32)`

SetIndex sets Index field to given value.


### GetFlagged

`func (o *ModerationResult) GetFlagged() bool`

GetFlagged returns the Flagged field if non-nil, zero value otherwise.

### GetFlaggedOk

`func (o *ModerationResult) GetFlaggedOk() (*bool, bool)`

GetFlaggedOk returns a tuple with the Flagged field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFlagged

`func (o *ModerationResult) SetFlagged(v bool)`

SetFlagged sets Flagged field to given value.


### GetCategories

`func (o *ModerationResult) GetCategories() map[string]bool`

GetCategories returns the Categories field if non-nil, zero value otherwise.

### GetCategoriesOk

`func (o *ModerationResult) GetCategoriesOk() (*map[string]bool, bool)`

GetCategoriesOk returns a tuple with the Categories field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCategories

`func (o *ModerationResult) SetCategories(v map[string]bool)`

SetCategories sets Categories field to given value.


### GetScores

`func (o *ModerationResult) GetScores() map[string]float32`

GetScores returns the Scores field if non-nil, zero value otherwise.

### GetScoresOk

`func (o *ModerationResult) GetScoresOk() (*map[string]float32, bool)`

GetScoresOk returns a tuple with the Scores field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScores

`func (o *ModerationResult) SetScores(v map[string]float32)`

SetScores sets Scores field to given value.


### GetAppliedInputTypes

`func (o *ModerationResult) GetAppliedInputTypes() map[string][]string`

GetAppliedInputTypes returns the AppliedInputTypes field if non-nil, zero value otherwise.

### GetAppliedInputTypesOk

`func (o *ModerationResult) GetAppliedInputTypesOk() (*map[string][]string, bool)`

GetAppliedInputTypesOk returns a tuple with the AppliedInputTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppliedInputTypes

`func (o *ModerationResult) SetAppliedInputTypes(v map[string][]string)`

SetAppliedInputTypes sets AppliedInputTypes field to given value.

### HasAppliedInputTypes

`func (o *ModerationResult) HasAppliedInputTypes() bool`

HasAppliedInputTypes returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


