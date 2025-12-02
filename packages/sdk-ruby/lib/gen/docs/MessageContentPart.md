# AIStatsSdk::MessageContentPart

## Class instance methods

### `openapi_one_of`

Returns the list of classes defined in oneOf.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::MessageContentPart.openapi_one_of
# =>
# [
#   :'MessageContentImageUrl',
#   :'MessageContentInputAudio',
#   :'MessageContentInputVideo',
#   :'MessageContentText',
#   :'ToolCallPart'
# ]
```

### `openapi_discriminator_name`

Returns the discriminator's property name.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::MessageContentPart.openapi_discriminator_name
# => :'type'
```

### `openapi_discriminator_name`

Returns the discriminator's mapping.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::MessageContentPart.openapi_discriminator_mapping
# =>
# {
#   :'image_url' => :'MessageContentImageUrl',
#   :'input_audio' => :'MessageContentInputAudio',
#   :'input_video' => :'MessageContentInputVideo',
#   :'text' => :'MessageContentText',
#   :'tool_call' => :'ToolCallPart'
# }
```

### build

Find the appropriate object from the `openapi_one_of` list and casts the data into it.

#### Example

```ruby
require 'ai_stats_sdk'

AIStatsSdk::MessageContentPart.build(data)
# => #<MessageContentImageUrl:0x00007fdd4aab02a0>

AIStatsSdk::MessageContentPart.build(data_that_doesnt_match)
# => nil
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| **data** | **Mixed** | data to be matched against the list of oneOf items |

#### Return type

- `MessageContentImageUrl`
- `MessageContentInputAudio`
- `MessageContentInputVideo`
- `MessageContentText`
- `ToolCallPart`
- `nil` (if no type matches)

