# GatewayGenerationRecord

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RequestId** | **string** |  | 
**TeamId** | **string** |  | 
**AppId** | Pointer to **string** |  | [optional] 
**AppTitle** | Pointer to **string** |  | [optional] 
**Referer** | Pointer to **string** |  | [optional] 
**Endpoint** | **string** |  | 
**ModelId** | Pointer to **string** |  | [optional] 
**Provider** | Pointer to **string** |  | [optional] 
**NativeResponseId** | Pointer to **string** |  | [optional] 
**Stream** | Pointer to **bool** |  | [optional] 
**Byok** | Pointer to **bool** |  | [optional] 
**StatusCode** | Pointer to **int32** |  | [optional] 
**Success** | **bool** |  | 
**ErrorCode** | Pointer to **string** |  | [optional] 
**ErrorMessage** | Pointer to **string** |  | [optional] 
**Before** | Pointer to **map[string]interface{}** |  | [optional] 
**Execute** | Pointer to **map[string]interface{}** |  | [optional] 
**LatencyMs** | Pointer to **float32** |  | [optional] 
**GenerationMs** | Pointer to **float32** |  | [optional] 
**Usage** | Pointer to **map[string]interface{}** |  | [optional] 
**CostNanos** | Pointer to **int32** |  | [optional] 
**Currency** | Pointer to **string** |  | [optional] 
**PricingLines** | Pointer to **[]map[string]interface{}** |  | [optional] 

## Methods

### NewGatewayGenerationRecord

`func NewGatewayGenerationRecord(requestId string, teamId string, endpoint string, success bool, ) *GatewayGenerationRecord`

NewGatewayGenerationRecord instantiates a new GatewayGenerationRecord object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGatewayGenerationRecordWithDefaults

`func NewGatewayGenerationRecordWithDefaults() *GatewayGenerationRecord`

NewGatewayGenerationRecordWithDefaults instantiates a new GatewayGenerationRecord object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRequestId

`func (o *GatewayGenerationRecord) GetRequestId() string`

GetRequestId returns the RequestId field if non-nil, zero value otherwise.

### GetRequestIdOk

`func (o *GatewayGenerationRecord) GetRequestIdOk() (*string, bool)`

GetRequestIdOk returns a tuple with the RequestId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestId

`func (o *GatewayGenerationRecord) SetRequestId(v string)`

SetRequestId sets RequestId field to given value.


### GetTeamId

`func (o *GatewayGenerationRecord) GetTeamId() string`

GetTeamId returns the TeamId field if non-nil, zero value otherwise.

### GetTeamIdOk

`func (o *GatewayGenerationRecord) GetTeamIdOk() (*string, bool)`

GetTeamIdOk returns a tuple with the TeamId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTeamId

`func (o *GatewayGenerationRecord) SetTeamId(v string)`

SetTeamId sets TeamId field to given value.


### GetAppId

`func (o *GatewayGenerationRecord) GetAppId() string`

GetAppId returns the AppId field if non-nil, zero value otherwise.

### GetAppIdOk

`func (o *GatewayGenerationRecord) GetAppIdOk() (*string, bool)`

GetAppIdOk returns a tuple with the AppId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppId

`func (o *GatewayGenerationRecord) SetAppId(v string)`

SetAppId sets AppId field to given value.

### HasAppId

`func (o *GatewayGenerationRecord) HasAppId() bool`

HasAppId returns a boolean if a field has been set.

### GetAppTitle

`func (o *GatewayGenerationRecord) GetAppTitle() string`

GetAppTitle returns the AppTitle field if non-nil, zero value otherwise.

### GetAppTitleOk

`func (o *GatewayGenerationRecord) GetAppTitleOk() (*string, bool)`

GetAppTitleOk returns a tuple with the AppTitle field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAppTitle

`func (o *GatewayGenerationRecord) SetAppTitle(v string)`

SetAppTitle sets AppTitle field to given value.

### HasAppTitle

`func (o *GatewayGenerationRecord) HasAppTitle() bool`

HasAppTitle returns a boolean if a field has been set.

### GetReferer

`func (o *GatewayGenerationRecord) GetReferer() string`

GetReferer returns the Referer field if non-nil, zero value otherwise.

### GetRefererOk

`func (o *GatewayGenerationRecord) GetRefererOk() (*string, bool)`

GetRefererOk returns a tuple with the Referer field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReferer

`func (o *GatewayGenerationRecord) SetReferer(v string)`

SetReferer sets Referer field to given value.

### HasReferer

`func (o *GatewayGenerationRecord) HasReferer() bool`

HasReferer returns a boolean if a field has been set.

### GetEndpoint

`func (o *GatewayGenerationRecord) GetEndpoint() string`

GetEndpoint returns the Endpoint field if non-nil, zero value otherwise.

### GetEndpointOk

`func (o *GatewayGenerationRecord) GetEndpointOk() (*string, bool)`

GetEndpointOk returns a tuple with the Endpoint field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEndpoint

`func (o *GatewayGenerationRecord) SetEndpoint(v string)`

SetEndpoint sets Endpoint field to given value.


### GetModelId

`func (o *GatewayGenerationRecord) GetModelId() string`

GetModelId returns the ModelId field if non-nil, zero value otherwise.

### GetModelIdOk

`func (o *GatewayGenerationRecord) GetModelIdOk() (*string, bool)`

GetModelIdOk returns a tuple with the ModelId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModelId

`func (o *GatewayGenerationRecord) SetModelId(v string)`

SetModelId sets ModelId field to given value.

### HasModelId

`func (o *GatewayGenerationRecord) HasModelId() bool`

HasModelId returns a boolean if a field has been set.

### GetProvider

`func (o *GatewayGenerationRecord) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *GatewayGenerationRecord) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *GatewayGenerationRecord) SetProvider(v string)`

SetProvider sets Provider field to given value.

### HasProvider

`func (o *GatewayGenerationRecord) HasProvider() bool`

HasProvider returns a boolean if a field has been set.

### GetNativeResponseId

`func (o *GatewayGenerationRecord) GetNativeResponseId() string`

GetNativeResponseId returns the NativeResponseId field if non-nil, zero value otherwise.

### GetNativeResponseIdOk

`func (o *GatewayGenerationRecord) GetNativeResponseIdOk() (*string, bool)`

GetNativeResponseIdOk returns a tuple with the NativeResponseId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNativeResponseId

`func (o *GatewayGenerationRecord) SetNativeResponseId(v string)`

SetNativeResponseId sets NativeResponseId field to given value.

### HasNativeResponseId

`func (o *GatewayGenerationRecord) HasNativeResponseId() bool`

HasNativeResponseId returns a boolean if a field has been set.

### GetStream

`func (o *GatewayGenerationRecord) GetStream() bool`

GetStream returns the Stream field if non-nil, zero value otherwise.

### GetStreamOk

`func (o *GatewayGenerationRecord) GetStreamOk() (*bool, bool)`

GetStreamOk returns a tuple with the Stream field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStream

`func (o *GatewayGenerationRecord) SetStream(v bool)`

SetStream sets Stream field to given value.

### HasStream

`func (o *GatewayGenerationRecord) HasStream() bool`

HasStream returns a boolean if a field has been set.

### GetByok

`func (o *GatewayGenerationRecord) GetByok() bool`

GetByok returns the Byok field if non-nil, zero value otherwise.

### GetByokOk

`func (o *GatewayGenerationRecord) GetByokOk() (*bool, bool)`

GetByokOk returns a tuple with the Byok field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetByok

`func (o *GatewayGenerationRecord) SetByok(v bool)`

SetByok sets Byok field to given value.

### HasByok

`func (o *GatewayGenerationRecord) HasByok() bool`

HasByok returns a boolean if a field has been set.

### GetStatusCode

`func (o *GatewayGenerationRecord) GetStatusCode() int32`

GetStatusCode returns the StatusCode field if non-nil, zero value otherwise.

### GetStatusCodeOk

`func (o *GatewayGenerationRecord) GetStatusCodeOk() (*int32, bool)`

GetStatusCodeOk returns a tuple with the StatusCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatusCode

`func (o *GatewayGenerationRecord) SetStatusCode(v int32)`

SetStatusCode sets StatusCode field to given value.

### HasStatusCode

`func (o *GatewayGenerationRecord) HasStatusCode() bool`

HasStatusCode returns a boolean if a field has been set.

### GetSuccess

`func (o *GatewayGenerationRecord) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *GatewayGenerationRecord) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *GatewayGenerationRecord) SetSuccess(v bool)`

SetSuccess sets Success field to given value.


### GetErrorCode

`func (o *GatewayGenerationRecord) GetErrorCode() string`

GetErrorCode returns the ErrorCode field if non-nil, zero value otherwise.

### GetErrorCodeOk

`func (o *GatewayGenerationRecord) GetErrorCodeOk() (*string, bool)`

GetErrorCodeOk returns a tuple with the ErrorCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrorCode

`func (o *GatewayGenerationRecord) SetErrorCode(v string)`

SetErrorCode sets ErrorCode field to given value.

### HasErrorCode

`func (o *GatewayGenerationRecord) HasErrorCode() bool`

HasErrorCode returns a boolean if a field has been set.

### GetErrorMessage

`func (o *GatewayGenerationRecord) GetErrorMessage() string`

GetErrorMessage returns the ErrorMessage field if non-nil, zero value otherwise.

### GetErrorMessageOk

`func (o *GatewayGenerationRecord) GetErrorMessageOk() (*string, bool)`

GetErrorMessageOk returns a tuple with the ErrorMessage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrorMessage

`func (o *GatewayGenerationRecord) SetErrorMessage(v string)`

SetErrorMessage sets ErrorMessage field to given value.

### HasErrorMessage

`func (o *GatewayGenerationRecord) HasErrorMessage() bool`

HasErrorMessage returns a boolean if a field has been set.

### GetBefore

`func (o *GatewayGenerationRecord) GetBefore() map[string]interface{}`

GetBefore returns the Before field if non-nil, zero value otherwise.

### GetBeforeOk

`func (o *GatewayGenerationRecord) GetBeforeOk() (*map[string]interface{}, bool)`

GetBeforeOk returns a tuple with the Before field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBefore

`func (o *GatewayGenerationRecord) SetBefore(v map[string]interface{})`

SetBefore sets Before field to given value.

### HasBefore

`func (o *GatewayGenerationRecord) HasBefore() bool`

HasBefore returns a boolean if a field has been set.

### GetExecute

`func (o *GatewayGenerationRecord) GetExecute() map[string]interface{}`

GetExecute returns the Execute field if non-nil, zero value otherwise.

### GetExecuteOk

`func (o *GatewayGenerationRecord) GetExecuteOk() (*map[string]interface{}, bool)`

GetExecuteOk returns a tuple with the Execute field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExecute

`func (o *GatewayGenerationRecord) SetExecute(v map[string]interface{})`

SetExecute sets Execute field to given value.

### HasExecute

`func (o *GatewayGenerationRecord) HasExecute() bool`

HasExecute returns a boolean if a field has been set.

### GetLatencyMs

`func (o *GatewayGenerationRecord) GetLatencyMs() float32`

GetLatencyMs returns the LatencyMs field if non-nil, zero value otherwise.

### GetLatencyMsOk

`func (o *GatewayGenerationRecord) GetLatencyMsOk() (*float32, bool)`

GetLatencyMsOk returns a tuple with the LatencyMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLatencyMs

`func (o *GatewayGenerationRecord) SetLatencyMs(v float32)`

SetLatencyMs sets LatencyMs field to given value.

### HasLatencyMs

`func (o *GatewayGenerationRecord) HasLatencyMs() bool`

HasLatencyMs returns a boolean if a field has been set.

### GetGenerationMs

`func (o *GatewayGenerationRecord) GetGenerationMs() float32`

GetGenerationMs returns the GenerationMs field if non-nil, zero value otherwise.

### GetGenerationMsOk

`func (o *GatewayGenerationRecord) GetGenerationMsOk() (*float32, bool)`

GetGenerationMsOk returns a tuple with the GenerationMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGenerationMs

`func (o *GatewayGenerationRecord) SetGenerationMs(v float32)`

SetGenerationMs sets GenerationMs field to given value.

### HasGenerationMs

`func (o *GatewayGenerationRecord) HasGenerationMs() bool`

HasGenerationMs returns a boolean if a field has been set.

### GetUsage

`func (o *GatewayGenerationRecord) GetUsage() map[string]interface{}`

GetUsage returns the Usage field if non-nil, zero value otherwise.

### GetUsageOk

`func (o *GatewayGenerationRecord) GetUsageOk() (*map[string]interface{}, bool)`

GetUsageOk returns a tuple with the Usage field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUsage

`func (o *GatewayGenerationRecord) SetUsage(v map[string]interface{})`

SetUsage sets Usage field to given value.

### HasUsage

`func (o *GatewayGenerationRecord) HasUsage() bool`

HasUsage returns a boolean if a field has been set.

### GetCostNanos

`func (o *GatewayGenerationRecord) GetCostNanos() int32`

GetCostNanos returns the CostNanos field if non-nil, zero value otherwise.

### GetCostNanosOk

`func (o *GatewayGenerationRecord) GetCostNanosOk() (*int32, bool)`

GetCostNanosOk returns a tuple with the CostNanos field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCostNanos

`func (o *GatewayGenerationRecord) SetCostNanos(v int32)`

SetCostNanos sets CostNanos field to given value.

### HasCostNanos

`func (o *GatewayGenerationRecord) HasCostNanos() bool`

HasCostNanos returns a boolean if a field has been set.

### GetCurrency

`func (o *GatewayGenerationRecord) GetCurrency() string`

GetCurrency returns the Currency field if non-nil, zero value otherwise.

### GetCurrencyOk

`func (o *GatewayGenerationRecord) GetCurrencyOk() (*string, bool)`

GetCurrencyOk returns a tuple with the Currency field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCurrency

`func (o *GatewayGenerationRecord) SetCurrency(v string)`

SetCurrency sets Currency field to given value.

### HasCurrency

`func (o *GatewayGenerationRecord) HasCurrency() bool`

HasCurrency returns a boolean if a field has been set.

### GetPricingLines

`func (o *GatewayGenerationRecord) GetPricingLines() []map[string]interface{}`

GetPricingLines returns the PricingLines field if non-nil, zero value otherwise.

### GetPricingLinesOk

`func (o *GatewayGenerationRecord) GetPricingLinesOk() (*[]map[string]interface{}, bool)`

GetPricingLinesOk returns a tuple with the PricingLines field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPricingLines

`func (o *GatewayGenerationRecord) SetPricingLines(v []map[string]interface{})`

SetPricingLines sets PricingLines field to given value.

### HasPricingLines

`func (o *GatewayGenerationRecord) HasPricingLines() bool`

HasPricingLines returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


