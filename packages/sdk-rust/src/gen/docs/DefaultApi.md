# \DefaultApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_batch**](DefaultApi.md#create_batch) | **POST** /batches | Create batch
[**create_chat_completion**](DefaultApi.md#create_chat_completion) | **POST** /chat/completions | Create chat completion
[**create_embedding**](DefaultApi.md#create_embedding) | **POST** /embeddings | Create embeddings
[**create_image**](DefaultApi.md#create_image) | **POST** /images/generations | Create image
[**create_image_edit**](DefaultApi.md#create_image_edit) | **POST** /images/edits | Create image edit
[**create_moderation**](DefaultApi.md#create_moderation) | **POST** /moderations | Create moderation
[**create_response**](DefaultApi.md#create_response) | **POST** /responses | Create response
[**create_speech**](DefaultApi.md#create_speech) | **POST** /audio/speech | Generate speech
[**create_transcription**](DefaultApi.md#create_transcription) | **POST** /audio/transcriptions | Create transcription
[**create_translation**](DefaultApi.md#create_translation) | **POST** /audio/translations | Create translation
[**create_video**](DefaultApi.md#create_video) | **POST** /videos | Create video
[**get_analytics**](DefaultApi.md#get_analytics) | **POST** /analytics | Get analytics
[**get_generation**](DefaultApi.md#get_generation) | **GET** /generation | Get generation
[**healthz**](DefaultApi.md#healthz) | **GET** /healthz | Health check
[**list_files**](DefaultApi.md#list_files) | **GET** /files | List files
[**list_models**](DefaultApi.md#list_models) | **GET** /models | List models
[**retrieve_batch**](DefaultApi.md#retrieve_batch) | **GET** /batches/{batch_id} | Retrieve batch
[**retrieve_file**](DefaultApi.md#retrieve_file) | **GET** /files/{file_id} | Retrieve file
[**root**](DefaultApi.md#root) | **GET** / | Root endpoint
[**upload_file**](DefaultApi.md#upload_file) | **POST** /files | Upload file



## create_batch

> models::BatchResponse create_batch(batch_request)
Create batch

Creates a batch of API requests.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**batch_request** | [**BatchRequest**](BatchRequest.md) |  | [required] |

### Return type

[**models::BatchResponse**](BatchResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_chat_completion

> models::ChatCompletionsResponse create_chat_completion(chat_completions_request)
Create chat completion

Creates a completion for the chat message.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**chat_completions_request** | [**ChatCompletionsRequest**](ChatCompletionsRequest.md) |  | [required] |

### Return type

[**models::ChatCompletionsResponse**](ChatCompletionsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_embedding

> models::EmbeddingsResponse create_embedding(embeddings_request)
Create embeddings

Creates an embedding vector representing the input text.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**embeddings_request** | [**EmbeddingsRequest**](EmbeddingsRequest.md) |  | [required] |

### Return type

[**models::EmbeddingsResponse**](EmbeddingsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_image

> models::ImagesGenerationResponse create_image(images_generation_request)
Create image

Creates an image given a prompt.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**images_generation_request** | [**ImagesGenerationRequest**](ImagesGenerationRequest.md) |  | [required] |

### Return type

[**models::ImagesGenerationResponse**](ImagesGenerationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_image_edit

> models::ImagesEditResponse create_image_edit(model, image, prompt, mask, size, n, user, meta, usage)
Create image edit

Creates an edited or extended image given an original image and a prompt.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**model** | **String** |  | [required] |
**image** | **String** |  | [required] |
**prompt** | **String** |  | [required] |
**mask** | Option<**String**> |  |  |
**size** | Option<**String**> |  |  |
**n** | Option<**i32**> |  |  |
**user** | Option<**String**> |  |  |
**meta** | Option<**bool**> |  |  |
**usage** | Option<**bool**> |  |  |

### Return type

[**models::ImagesEditResponse**](ImagesEditResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_moderation

> models::ModerationsResponse create_moderation(moderations_request)
Create moderation

Classifies if text violates OpenAI's usage policies.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**moderations_request** | [**ModerationsRequest**](ModerationsRequest.md) |  | [required] |

### Return type

[**models::ModerationsResponse**](ModerationsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_response

> models::ResponsesResponse create_response(responses_request)
Create response

Creates a response using the Responses API.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**responses_request** | [**ResponsesRequest**](ResponsesRequest.md) |  | [required] |

### Return type

[**models::ResponsesResponse**](ResponsesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_speech

> std::path::PathBuf create_speech(audio_speech_request)
Generate speech

Generates audio from the input text.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**audio_speech_request** | [**AudioSpeechRequest**](AudioSpeechRequest.md) |  | [required] |

### Return type

[**std::path::PathBuf**](std::path::PathBuf.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: audio/mpeg

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_transcription

> models::AudioTranscriptionResponse create_transcription(model, audio_url, audio_b64, language)
Create transcription

Transcribes audio into the input language.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**model** | **String** |  | [required] |
**audio_url** | Option<**String**> |  |  |
**audio_b64** | Option<**String**> |  |  |
**language** | Option<**String**> |  |  |

### Return type

[**models::AudioTranscriptionResponse**](AudioTranscriptionResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_translation

> models::AudioTranslationResponse create_translation(model, audio_url, audio_b64, language, prompt, temperature)
Create translation

Translates audio into English.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**model** | **String** |  | [required] |
**audio_url** | Option<**String**> |  |  |
**audio_b64** | Option<**String**> |  |  |
**language** | Option<**String**> |  |  |
**prompt** | Option<**String**> |  |  |
**temperature** | Option<**f64**> |  |  |

### Return type

[**models::AudioTranslationResponse**](AudioTranslationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## create_video

> models::VideoGenerationResponse create_video(video_generation_request)
Create video

Creates a video from a prompt.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**video_generation_request** | [**VideoGenerationRequest**](VideoGenerationRequest.md) |  | [required] |

### Return type

[**models::VideoGenerationResponse**](VideoGenerationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_analytics

> models::GetAnalytics200Response get_analytics(get_analytics_request)
Get analytics

Returns aggregated analytics data.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**get_analytics_request** | [**GetAnalyticsRequest**](GetAnalyticsRequest.md) |  | [required] |

### Return type

[**models::GetAnalytics200Response**](getAnalytics_200_response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## get_generation

> models::GenerationResponse get_generation(id)
Get generation

Retrieve a specific generation by ID.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**id** | **String** | The ID of the generation | [required] |

### Return type

[**models::GenerationResponse**](GenerationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## healthz

> models::Healthz200Response healthz()
Health check

Returns the health status of the API.

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::Healthz200Response**](healthz_200_response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_files

> models::ListFilesResponse list_files()
List files

Returns a list of files that belong to the user's organization.

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::ListFilesResponse**](ListFilesResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## list_models

> models::ListModels200Response list_models(endpoints, organisation, input_types, output_types, params, limit, offset)
List models

Returns a list of available models.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**endpoints** | Option<[**Vec<String>**](String.md)> | Filter by endpoints |  |
**organisation** | Option<[**ListModelsOrganisationParameter**](.md)> | Filter by organisation |  |
**input_types** | Option<[**Vec<String>**](String.md)> | Filter by input types |  |
**output_types** | Option<[**Vec<String>**](String.md)> | Filter by output types |  |
**params** | Option<[**Vec<String>**](String.md)> | Filter by params |  |
**limit** | Option<**i32**> | Limit the number of results |  |[default to 50]
**offset** | Option<**i32**> | Offset for pagination |  |[default to 0]

### Return type

[**models::ListModels200Response**](listModels_200_response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## retrieve_batch

> models::BatchResponse retrieve_batch(batch_id)
Retrieve batch

Retrieves a batch.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**batch_id** | **String** | The ID of the batch to retrieve. | [required] |

### Return type

[**models::BatchResponse**](BatchResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## retrieve_file

> models::FileResponse retrieve_file(file_id)
Retrieve file

Returns information about a specific file.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**file_id** | **String** | The ID of the file to retrieve. | [required] |

### Return type

[**models::FileResponse**](FileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## root

> models::Root200Response root()
Root endpoint

Returns a welcome message.

### Parameters

This endpoint does not need any parameter.

### Return type

[**models::Root200Response**](root_200_response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)


## upload_file

> models::FileResponse upload_file(file, purpose)
Upload file

Upload a file that can be used across various endpoints.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**file** | **std::path::PathBuf** |  | [required] |
**purpose** | **String** |  | [required] |

### Return type

[**models::FileResponse**](FileResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

