# AIStatsSdk::AudioApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**audio_speech_post**](AudioApi.md#audio_speech_post) | **POST** /audio/speech | Generate audio from text |
| [**audio_transcriptions_post**](AudioApi.md#audio_transcriptions_post) | **POST** /audio/transcriptions | Transcribe audio |
| [**audio_translations_post**](AudioApi.md#audio_translations_post) | **POST** /audio/translations | Translate audio |


## audio_speech_post

> File audio_speech_post(audio_speech_request)

Generate audio from text

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::AudioApi.new
audio_speech_request = AIStatsSdk::AudioSpeechRequest.new({model: 'model_example', input: 'input_example'}) # AudioSpeechRequest | 

begin
  # Generate audio from text
  result = api_instance.audio_speech_post(audio_speech_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_speech_post: #{e}"
end
```

#### Using the audio_speech_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(File, Integer, Hash)> audio_speech_post_with_http_info(audio_speech_request)

```ruby
begin
  # Generate audio from text
  data, status_code, headers = api_instance.audio_speech_post_with_http_info(audio_speech_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => File
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_speech_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **audio_speech_request** | [**AudioSpeechRequest**](AudioSpeechRequest.md) |  |  |

### Return type

**File**

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: audio/mpeg, application/json


## audio_transcriptions_post

> <AudioTranscriptionResponse> audio_transcriptions_post(audio_transcription_request)

Transcribe audio

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::AudioApi.new
audio_transcription_request = AIStatsSdk::AudioTranscriptionRequest.new({model: 'model_example'}) # AudioTranscriptionRequest | 

begin
  # Transcribe audio
  result = api_instance.audio_transcriptions_post(audio_transcription_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_transcriptions_post: #{e}"
end
```

#### Using the audio_transcriptions_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<AudioTranscriptionResponse>, Integer, Hash)> audio_transcriptions_post_with_http_info(audio_transcription_request)

```ruby
begin
  # Transcribe audio
  data, status_code, headers = api_instance.audio_transcriptions_post_with_http_info(audio_transcription_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <AudioTranscriptionResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_transcriptions_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **audio_transcription_request** | [**AudioTranscriptionRequest**](AudioTranscriptionRequest.md) |  |  |

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## audio_translations_post

> <AudioTranscriptionResponse> audio_translations_post(audio_translation_request)

Translate audio

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::AudioApi.new
audio_translation_request = AIStatsSdk::AudioTranslationRequest.new({model: 'model_example'}) # AudioTranslationRequest | 

begin
  # Translate audio
  result = api_instance.audio_translations_post(audio_translation_request)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_translations_post: #{e}"
end
```

#### Using the audio_translations_post_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<AudioTranscriptionResponse>, Integer, Hash)> audio_translations_post_with_http_info(audio_translation_request)

```ruby
begin
  # Translate audio
  data, status_code, headers = api_instance.audio_translations_post_with_http_info(audio_translation_request)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <AudioTranscriptionResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling AudioApi->audio_translations_post_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **audio_translation_request** | [**AudioTranslationRequest**](AudioTranslationRequest.md) |  |  |

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

