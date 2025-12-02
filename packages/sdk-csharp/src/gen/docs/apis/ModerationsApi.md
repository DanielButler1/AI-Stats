# AIStatsSdk.Api.ModerationsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ModerationsPost**](ModerationsApi.md#moderationspost) | **POST** /moderations | Score content with moderation models |

<a id="moderationspost"></a>
# **ModerationsPost**
> ModerationResponse ModerationsPost (ModerationRequest moderationRequest)

Score content with moderation models

Evaluates text input against provider moderation policies and returns the gateway-normalised safety scores.


### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **moderationRequest** | [**ModerationRequest**](ModerationRequest.md) |  |  |

### Return type

[**ModerationResponse**](ModerationResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Moderation results returned successfully. |  -  |
| **400** | Gateway error response |  -  |
| **401** | Gateway error response |  -  |
| **402** | Gateway error response |  -  |
| **404** | Gateway error response |  -  |
| **429** | Gateway error response |  -  |
| **500** | Gateway error response |  -  |

[[Back to top]](#) [[Back to API list]](../../README.md#documentation-for-api-endpoints) [[Back to Model list]](../../README.md#documentation-for-models) [[Back to README]](../../README.md)

