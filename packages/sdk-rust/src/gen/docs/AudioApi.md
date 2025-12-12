# \AudioApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**audio_speech_post**](AudioApi.md#audio_speech_post) | **POST** /audio/speech | Generate audio from text
[**audio_transcriptions_post**](AudioApi.md#audio_transcriptions_post) | **POST** /audio/transcriptions | Transcribe audio
[**audio_translations_post**](AudioApi.md#audio_translations_post) | **POST** /audio/translations | Translate audio



## audio_speech_post

> std::path::PathBuf audio_speech_post(audio_speech_request)
Generate audio from text

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**audio_speech_request** | [**AudioSpeechRequest**](AudioSpeechRequest.md) |  | [required] |

### Return type

[**std::path::PathBuf**](std::path::PathBuf.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: audio/mpeg, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## audio_transcriptions_post

> models::AudioTranscriptionResponse audio_transcriptions_post(audio_transcription_request)
Transcribe audio

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**audio_transcription_request** | [**AudioTranscriptionRequest**](AudioTranscriptionRequest.md) |  | [required] |

### Return type

[**models::AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## audio_translations_post

> models::AudioTranscriptionResponse audio_translations_post(audio_translation_request)
Translate audio

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**audio_translation_request** | [**AudioTranslationRequest**](AudioTranslationRequest.md) |  | [required] |

### Return type

[**models::AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

