# AIStatsSdk::AudioTranscriptionRequest

## Properties

| Name | Type | Description | Notes |
| ---- | ---- | ----------- | ----- |
| **model** | **String** |  |  |
| **audio_url** | **String** |  | [optional] |
| **audio_b64** | **String** |  | [optional] |
| **language** | **String** |  | [optional] |

## Example

```ruby
require 'ai_stats_sdk'

instance = AIStatsSdk::AudioTranscriptionRequest.new(
  model: null,
  audio_url: null,
  audio_b64: null,
  language: null
)
```

