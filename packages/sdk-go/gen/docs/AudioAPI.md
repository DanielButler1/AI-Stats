# \AudioAPI

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**AudioSpeechPost**](AudioAPI.md#AudioSpeechPost) | **Post** /audio/speech | Generate audio from text
[**AudioTranscriptionsPost**](AudioAPI.md#AudioTranscriptionsPost) | **Post** /audio/transcriptions | Transcribe audio
[**AudioTranslationsPost**](AudioAPI.md#AudioTranslationsPost) | **Post** /audio/translations | Translate audio



## AudioSpeechPost

> *os.File AudioSpeechPost(ctx).AudioSpeechRequest(audioSpeechRequest).Execute()

Generate audio from text

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
	audioSpeechRequest := *openapiclient.NewAudioSpeechRequest("Model_example", "Input_example") // AudioSpeechRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AudioAPI.AudioSpeechPost(context.Background()).AudioSpeechRequest(audioSpeechRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AudioAPI.AudioSpeechPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `AudioSpeechPost`: *os.File
	fmt.Fprintf(os.Stdout, "Response from `AudioAPI.AudioSpeechPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiAudioSpeechPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **audioSpeechRequest** | [**AudioSpeechRequest**](AudioSpeechRequest.md) |  | 

### Return type

[***os.File**](*os.File.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: audio/mpeg, application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## AudioTranscriptionsPost

> AudioTranscriptionResponse AudioTranscriptionsPost(ctx).AudioTranscriptionRequest(audioTranscriptionRequest).Execute()

Transcribe audio

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
	audioTranscriptionRequest := *openapiclient.NewAudioTranscriptionRequest("Model_example") // AudioTranscriptionRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AudioAPI.AudioTranscriptionsPost(context.Background()).AudioTranscriptionRequest(audioTranscriptionRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AudioAPI.AudioTranscriptionsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `AudioTranscriptionsPost`: AudioTranscriptionResponse
	fmt.Fprintf(os.Stdout, "Response from `AudioAPI.AudioTranscriptionsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiAudioTranscriptionsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **audioTranscriptionRequest** | [**AudioTranscriptionRequest**](AudioTranscriptionRequest.md) |  | 

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## AudioTranslationsPost

> AudioTranscriptionResponse AudioTranslationsPost(ctx).AudioTranslationRequest(audioTranslationRequest).Execute()

Translate audio

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/GIT_USER_ID/GIT_REPO_ID"
)

func main() {
	audioTranslationRequest := *openapiclient.NewAudioTranslationRequest("Model_example") // AudioTranslationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AudioAPI.AudioTranslationsPost(context.Background()).AudioTranslationRequest(audioTranslationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AudioAPI.AudioTranslationsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `AudioTranslationsPost`: AudioTranscriptionResponse
	fmt.Fprintf(os.Stdout, "Response from `AudioAPI.AudioTranslationsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiAudioTranslationsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **audioTranslationRequest** | [**AudioTranslationRequest**](AudioTranslationRequest.md) |  | 

### Return type

[**AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

