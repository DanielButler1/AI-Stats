# AIStatsSdk::ModelsApi

All URIs are relative to *https://api.ai-stats.phaseo.app/v1*

| Method | HTTP request | Description |
| ------ | ------------ | ----------- |
| [**models_get**](ModelsApi.md#models_get) | **GET** /models | List all gateway models |


## models_get

> <ModelListResponse> models_get(opts)

List all gateway models

Returns a paginated catalogue of models with provider mappings, aliases, and endpoint support. Results are sorted by release date (falling back to announcement date) in descending order.

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
  provider: nil, # ModelsGetProviderParameter | Filter results to models served by one or more provider identifiers.
  limit: 56, # Integer | Maximum number of models to return (default 50).
  offset: 56, # Integer | Number of models to skip before starting the page.
  organisation: nil, # ModelsGetOrganisationParameter | Restrict results to models associated with one or more organisation identifiers.
  include_endpoints: nil, # ModelsGetIncludeEndpointsParameter | Only return models that support at least one of the specified gateway endpoints.
  exclude_endpoints: nil, # ModelsGetIncludeEndpointsParameter | Exclude models that support any of the specified gateway endpoints.
  input_types: nil, # ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested input content types.
  output_types: nil, # ModelsGetProviderParameter | Only return models that advertise support for at least one of the requested output content types.
  include_rumoured: true, # Boolean | Whether to include models marked as rumoured in the response (default true).
  include_deprecated: true, # Boolean | Whether to include models marked as deprecated in the response (default true).
  include_retired: true # Boolean | Whether to include models marked as retired in the response (default true).
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
| **provider** | [**ModelsGetProviderParameter**](.md) | Filter results to models served by one or more provider identifiers. | [optional] |
| **limit** | **Integer** | Maximum number of models to return (default 50). | [optional] |
| **offset** | **Integer** | Number of models to skip before starting the page. | [optional] |
| **organisation** | [**ModelsGetOrganisationParameter**](.md) | Restrict results to models associated with one or more organisation identifiers. | [optional] |
| **include_endpoints** | [**ModelsGetIncludeEndpointsParameter**](.md) | Only return models that support at least one of the specified gateway endpoints. | [optional] |
| **exclude_endpoints** | [**ModelsGetIncludeEndpointsParameter**](.md) | Exclude models that support any of the specified gateway endpoints. | [optional] |
| **input_types** | [**ModelsGetProviderParameter**](.md) | Only return models that advertise support for at least one of the requested input content types. | [optional] |
| **output_types** | [**ModelsGetProviderParameter**](.md) | Only return models that advertise support for at least one of the requested output content types. | [optional] |
| **include_rumoured** | **Boolean** | Whether to include models marked as rumoured in the response (default true). | [optional][default to true] |
| **include_deprecated** | **Boolean** | Whether to include models marked as deprecated in the response (default true). | [optional][default to true] |
| **include_retired** | **Boolean** | Whether to include models marked as retired in the response (default true). | [optional][default to true] |

### Return type

[**ModelListResponse**](ModelListResponse.md)

### Authorization

[GatewayAuth](../README.md#GatewayAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

