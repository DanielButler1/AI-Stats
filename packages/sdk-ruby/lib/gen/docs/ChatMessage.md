# AIStatsSdk::ChatMessage

## Class instance methods

### `openapi_one_of`

Returns the list of classes defined in oneOf.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::ChatMessage.openapi_one_of
# =>
# [
#   :'ChatMessageAssistant',
#   :'ChatMessageSystem',
#   :'ChatMessageTool',
#   :'ChatMessageUser'
# ]
```

### `openapi_discriminator_name`

Returns the discriminator's property name.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::ChatMessage.openapi_discriminator_name
# => :'role'
```

### `openapi_discriminator_name`

Returns the discriminator's mapping.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::ChatMessage.openapi_discriminator_mapping
# =>
# {
#   :'assistant' => :'ChatMessageAssistant',
#   :'system' => :'ChatMessageSystem',
#   :'tool' => :'ChatMessageTool',
#   :'user' => :'ChatMessageUser'
# }
```

### build

Find the appropriate object from the `openapi_one_of` list and casts the data into it.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::ChatMessage.build(data)
# => #<ChatMessageAssistant:0x00007fdd4aab02a0>

AIStatsSdk::ChatMessage.build(data_that_doesnt_match)
# => nil
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| **data** | **Mixed** | data to be matched against the list of oneOf items |

#### Return type

- `ChatMessageAssistant`
- `ChatMessageSystem`
- `ChatMessageTool`
- `ChatMessageUser`
- `nil` (if no type matches)

