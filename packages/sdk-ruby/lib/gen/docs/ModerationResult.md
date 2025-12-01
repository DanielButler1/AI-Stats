# AIStatsSdk::ModerationResult

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **index** | **Integer** |  |  |
| **flagged** | **Boolean** |  |  |
| **categories** | **Hash&lt;String, Boolean&gt;** |  |  |
| **scores** | **Hash&lt;String, Float&gt;** |  |  |
| **applied_input_types** | **Hash&lt;String, Array&lt;String&gt;&gt;** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::ModerationResult.new(
  index: null,
  flagged: null,
  categories: null,
  scores: null,
  applied_input_types: null
)
```

