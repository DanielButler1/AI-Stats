# AIStatsSdk::EmbeddingsRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **model** | **String** |  |  |
| **input** | [**EmbeddingsRequestInput**](EmbeddingsRequestInput.md) |  |  |
| **encoding_format** | **String** |  | [optional] |
| **dimensions** | **Integer** |  | [optional] |
| **user** | **String** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::EmbeddingsRequest.new(
  model: null,
  input: null,
  encoding_format: null,
  dimensions: null,
  user: null
)
```

