# AIStatsSdk::ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**models_get**](ModelsApi.md#models_get) | **GET** /models | List all gateway models |


## models_get

> <ModelListResponse> models_get(opts)

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date in descending order.

### Examples

```ruby
require 'time'
require 'ai_stats_sdk'
# setup authorization
AIStatsSdk.configure do |config|
  # Configure Bearer authorization (Gateway API key): GatewayAuth
  config.access_token = 'YOUR_BEARER_TOKEN'
end

api_instance = AIStatsSdk::ModelsApi.new
opts = {
  endpoints: nil, # ModelsGetEndpointsParameter | Only return models that support at least one of the specified gateway endpoints.
  organisation: nil, # ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers.
  input_types: nil, # ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested input content types.
  output_types: nil, # ModelsGetInputTypesParameter | Only return models that advertise support for at least one of the requested output content types.
  params: nil, # ModelsGetInputTypesParameter | Only return models that support at least one of the specified parameters.
  limit: 56, # Integer | Maximum number of models to return (default 50).
  offset: 56 # Integer | Number of models to skip before starting the page.
}

begin
  # List all gateway models
  result = api_instance.models_get(opts)
  p result
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ModelsApi->models_get: #{e}"
end
```

#### Using the models_get_with_http_info variant

This returns an Array which contains the response data, status code and headers.

> <Array(<ModelListResponse>, Integer, Hash)> models_get_with_http_info(opts)

```ruby
begin
  # List all gateway models
  data, status_code, headers = api_instance.models_get_with_http_info(opts)
  p status_code # => 2xx
  p headers # => { ... }
  p data # => <ModelListResponse>
rescue AIStatsSdk::ApiError => e
  puts "Error when calling ModelsApi->models_get_with_http_info: #{e}"
end
```

### Parameters

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **endpoints** | [**ModelsGetEndpointsParameter**](.md) | Only return models that support at least one of the specified gateway endpoints. | [optional] |
| **organisation** | [**ModelsGetOrganisationParameter**](.md) | Restrict results to models associated with one or more organisation identifiers. | [optional] |
| **input_types** | [**ModelsGetInputTypesParameter**](.md) | Only return models that advertise support for at least one of the requested input content types. | [optional] |
| **output_types** | [**ModelsGetInputTypesParameter**](.md) | Only return models that advertise support for at least one of the requested output content types. | [optional] |
| **params** | [**ModelsGetInputTypesParameter**](.md) | Only return models that support at least one of the specified parameters. | [optional] |
| **limit** | **Integer** | Maximum number of models to return (default 50). | [optional] |
| **offset** | **Integer** | Number of models to skip before starting the page. | [optional] |

### Return type

[**ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

