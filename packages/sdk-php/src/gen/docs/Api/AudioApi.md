# AIStats\\Sdk\AudioApi

Speech synthesis, transcription, and translation.

All URIs are relative to https://api.ai-stats.phaseo.app/v1, except if the operation defines another base path.

| Method | HTTP request | Description |
| ------------- | ------------- | ------------- |
| [**audioSpeechPost()**](AudioApi.md#audioSpeechPost) | **POST** /audio/speech | Generate audio from text |
| [**audioTranscriptionsPost()**](AudioApi.md#audioTranscriptionsPost) | **POST** /audio/transcriptions | Transcribe audio |
| [**audioTranslationsPost()**](AudioApi.md#audioTranslationsPost) | **POST** /audio/translations | Translate audio |


## `audioSpeechPost()`

```php
audioSpeechPost($audio_speech_request): \SplFileObject
```

Generate audio from text

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\AudioApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$audio_speech_request = new \AIStats\\Sdk\Model\AudioSpeechRequest(); // \AIStats\\Sdk\Model\AudioSpeechRequest

try {
    $result = $apiInstance->audioSpeechPost($audio_speech_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AudioApi->audioSpeechPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **audio_speech_request** | [**\AIStats\\Sdk\Model\AudioSpeechRequest**](../Model/AudioSpeechRequest.md)|  | |

### Return type

**\SplFileObject**

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `audio/mpeg`, `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `audioTranscriptionsPost()`

```php
audioTranscriptionsPost($audio_transcription_request): \AIStats\\Sdk\Model\AudioTranscriptionResponse
```

Transcribe audio

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\AudioApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$audio_transcription_request = new \AIStats\\Sdk\Model\AudioTranscriptionRequest(); // \AIStats\\Sdk\Model\AudioTranscriptionRequest

try {
    $result = $apiInstance->audioTranscriptionsPost($audio_transcription_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AudioApi->audioTranscriptionsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **audio_transcription_request** | [**\AIStats\\Sdk\Model\AudioTranscriptionRequest**](../Model/AudioTranscriptionRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\AudioTranscriptionResponse**](../Model/AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `audioTranslationsPost()`

```php
audioTranslationsPost($audio_translation_request): \AIStats\\Sdk\Model\AudioTranscriptionResponse
```

Translate audio

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\AudioApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$audio_translation_request = new \AIStats\\Sdk\Model\AudioTranslationRequest(); // \AIStats\\Sdk\Model\AudioTranslationRequest

try {
    $result = $apiInstance->audioTranslationsPost($audio_translation_request);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AudioApi->audioTranslationsPost: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

| Name | Type | Description  | Notes |
| ------------- | ------------- | ------------- | ------------- |
| **audio_translation_request** | [**\AIStats\\Sdk\Model\AudioTranslationRequest**](../Model/AudioTranslationRequest.md)|  | |

### Return type

[**\AIStats\\Sdk\Model\AudioTranscriptionResponse**](../Model/AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
