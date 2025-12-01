# AIStatsSdk

Programmatic access to the AI Stats AI Gateway. All endpoints forward requests to the best available provider for the specified model, and return normalised responses with clear structured metadata.

For more information, please visit [https://github.com/DanielButler1/ai-stats](https://github.com/DanielButler1/ai-stats).

## Installation & Usage

### Requirements

PHP 8.1 and later.

### Composer

To install the bindings via [Composer](https://getcomposer.org/), add the following to `composer.json`:

```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "https://github.com/GIT_USER_ID/GIT_REPO_ID.git"
    }
  ],
  "require": {
    "GIT_USER_ID/GIT_REPO_ID": "*@dev"
  }
}
```

Then run `composer install`

### Manual Installation

Download the files and include `autoload.php`:

```php
<?php
require_once('/path/to/AIStatsSdk/vendor/autoload.php');
```

## Getting Started

Please follow the [installation procedure](#installation--usage) and then run the following:

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');



// Configure Bearer (Gateway API key) authorization: GatewayAuth
$config = AIStats\\Sdk\Configuration::getDefaultConfiguration()->setAccessToken('YOUR_ACCESS_TOKEN');


$apiInstance = new AIStats\\Sdk\Api\AnalyticsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$provider = 'provider_example'; // string | Filter to a specific provider name.
$model = new \AIStats\\Sdk\Model\\AIStats\\Sdk\Model\ModelId(); // \AIStats\\Sdk\Model\ModelId | Optional model id used to resolve candidate providers.
$endpoint = 'endpoint_example'; // string | Endpoint identifier paired with `model` when deriving providers.

try {
    $result = $apiInstance->healthGet($provider, $model, $endpoint);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling AnalyticsApi->healthGet: ', $e->getMessage(), PHP_EOL;
}

```

## API Endpoints

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AnalyticsApi* | [**healthGet**](docs/Api/AnalyticsApi.md#healthget) | **GET** /health | Inspect provider health
*CompletionsApi* | [**createChatCompletion**](docs/Api/CompletionsApi.md#createchatcompletion) | **POST** /chat/completions | Create a chat completion
*GenerationsApi* | [**generationGet**](docs/Api/GenerationsApi.md#generationget) | **GET** /generation | Look up a past generation
*ImagesApi* | [**imagesGenerationsPost**](docs/Api/ImagesApi.md#imagesgenerationspost) | **POST** /images/generations | Generate images
*ModelsApi* | [**modelsGet**](docs/Api/ModelsApi.md#modelsget) | **GET** /models | List all gateway models
*ModerationsApi* | [**moderationsPost**](docs/Api/ModerationsApi.md#moderationspost) | **POST** /moderations | Score content with moderation models
*VideoApi* | [**videoGenerationPost**](docs/Api/VideoApi.md#videogenerationpost) | **POST** /video/generation | Generate video

## Models

- [BenchmarkId](docs/Model/BenchmarkId.md)
- [ChatCompletionsRequest](docs/Model/ChatCompletionsRequest.md)
- [ChatCompletionsRequestReasoning](docs/Model/ChatCompletionsRequestReasoning.md)
- [ChatCompletionsRequestToolChoice](docs/Model/ChatCompletionsRequestToolChoice.md)
- [ChatCompletionsResponse](docs/Model/ChatCompletionsResponse.md)
- [ChatMessage](docs/Model/ChatMessage.md)
- [ChatMessageAssistant](docs/Model/ChatMessageAssistant.md)
- [ChatMessageSystem](docs/Model/ChatMessageSystem.md)
- [ChatMessageTool](docs/Model/ChatMessageTool.md)
- [ChatMessageUser](docs/Model/ChatMessageUser.md)
- [GatewayChatChoice](docs/Model/GatewayChatChoice.md)
- [GatewayChatChoiceMessage](docs/Model/GatewayChatChoiceMessage.md)
- [GatewayError](docs/Model/GatewayError.md)
- [GatewayErrorMeta](docs/Model/GatewayErrorMeta.md)
- [GatewayGenerationRecord](docs/Model/GatewayGenerationRecord.md)
- [GatewayHealthProvider](docs/Model/GatewayHealthProvider.md)
- [GatewayHealthResponse](docs/Model/GatewayHealthResponse.md)
- [GatewayHealthResponseOverall](docs/Model/GatewayHealthResponseOverall.md)
- [GatewayHealthResponseScope](docs/Model/GatewayHealthResponseScope.md)
- [GatewayImageData](docs/Model/GatewayImageData.md)
- [GatewayMetadata](docs/Model/GatewayMetadata.md)
- [GatewayModel](docs/Model/GatewayModel.md)
- [GatewayModelProvider](docs/Model/GatewayModelProvider.md)
- [GatewayOrganisation](docs/Model/GatewayOrganisation.md)
- [GatewayResponseEnvelope](docs/Model/GatewayResponseEnvelope.md)
- [GatewayUsage](docs/Model/GatewayUsage.md)
- [ImageGenerationRequest](docs/Model/ImageGenerationRequest.md)
- [ImageGenerationResponse](docs/Model/ImageGenerationResponse.md)
- [MessageContent](docs/Model/MessageContent.md)
- [MessageContentImageUrl](docs/Model/MessageContentImageUrl.md)
- [MessageContentImageUrlImageUrl](docs/Model/MessageContentImageUrlImageUrl.md)
- [MessageContentInputAudio](docs/Model/MessageContentInputAudio.md)
- [MessageContentInputAudioInputAudio](docs/Model/MessageContentInputAudioInputAudio.md)
- [MessageContentInputVideo](docs/Model/MessageContentInputVideo.md)
- [MessageContentPart](docs/Model/MessageContentPart.md)
- [MessageContentText](docs/Model/MessageContentText.md)
- [ModelId](docs/Model/ModelId.md)
- [ModelListResponse](docs/Model/ModelListResponse.md)
- [ModelsGetIncludeEndpointsParameter](docs/Model/ModelsGetIncludeEndpointsParameter.md)
- [ModelsGetOrganisationParameter](docs/Model/ModelsGetOrganisationParameter.md)
- [ModelsGetProviderParameter](docs/Model/ModelsGetProviderParameter.md)
- [ModerationInputContentItem](docs/Model/ModerationInputContentItem.md)
- [ModerationInputImageUrlItem](docs/Model/ModerationInputImageUrlItem.md)
- [ModerationInputImageUrlItemImageUrl](docs/Model/ModerationInputImageUrlItemImageUrl.md)
- [ModerationInputTextItem](docs/Model/ModerationInputTextItem.md)
- [ModerationRequest](docs/Model/ModerationRequest.md)
- [ModerationRequestInput](docs/Model/ModerationRequestInput.md)
- [ModerationResponse](docs/Model/ModerationResponse.md)
- [ModerationResult](docs/Model/ModerationResult.md)
- [OrganisationId](docs/Model/OrganisationId.md)
- [ToolCall](docs/Model/ToolCall.md)
- [ToolCallFunction](docs/Model/ToolCallFunction.md)
- [ToolCallPart](docs/Model/ToolCallPart.md)
- [VideoGenerationRequest](docs/Model/VideoGenerationRequest.md)
- [VideoGenerationResponse](docs/Model/VideoGenerationResponse.md)

## Authorization

Authentication schemes defined for the API:
### GatewayAuth

- **Type**: Bearer authentication (Gateway API key)

## Tests

To run the tests, use:

```bash
composer install
vendor/bin/phpunit
```

## Author



## About this package

This PHP package is automatically generated by the [OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `0.1.0`
    - Generator version: `7.17.0`
- Build package: `org.openapitools.codegen.languages.PhpClientCodegen`
