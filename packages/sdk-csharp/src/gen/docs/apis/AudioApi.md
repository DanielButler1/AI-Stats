# AIStatsSdk.Api.AudioApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**AudioSpeechPost**](AudioApi.md#audiospeechpost) | **POST** /audio/speech | Generate audio from text |
| [**AudioTranscriptionsPost**](AudioApi.md#audiotranscriptionspost) | **POST** /audio/transcriptions | Transcribe audio |
| [**AudioTranslationsPost**](AudioApi.md#audiotranslationspost) | **POST** /audio/translations | Translate audio |

<a id="audiospeechpost"></a>
# **AudioSpeechPost**
> System.IO.Stream AudioSpeechPost (AudioSpeechRequest audioSpeechRequest)

Generate audio from text


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **audioSpeechRequest** | [**AudioSpeechRequest**](AudioSpeechRequest.md) |  |  |

### Return type

**System.IO.Stream**

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: audio/mpeg, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Audio stream. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="audiotranscriptionspost"></a>
# **AudioTranscriptionsPost**
> AudioTranscriptionResponse AudioTranscriptionsPost (AudioTranscriptionRequest audioTranscriptionRequest)

Transcribe audio


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **audioTranscriptionRequest** | [**AudioTranscriptionRequest**](AudioTranscriptionRequest.md) |  |  |

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transcription result. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

<a id="audiotranslationspost"></a>
# **AudioTranslationsPost**
> AudioTranscriptionResponse AudioTranslationsPost (AudioTranslationRequest audioTranslationRequest)

Translate audio


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **audioTranslationRequest** | [**AudioTranslationRequest**](AudioTranslationRequest.md) |  |  |

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Translation result. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

