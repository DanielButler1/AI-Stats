# \ModerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**moderations_post**](ModerationsApi.md#moderations_post) | **POST** /moderations | Score content with moderation models



## moderations_post

> models::ModerationResponse moderations_post(moderation_request)
Score content with moderation models

Evaluates text input against provider moderation policies and returns the gateway-normalised safety scores.

### Parameters


Name | Type | Description  | Required | Notes
------------- | ------------- | ------------- | ------------- | -------------
**moderation_request** | [**ModerationRequest**](ModerationRequest.md) |  | [required] |

### Return type

[**models::ModerationResponse**](ModerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

