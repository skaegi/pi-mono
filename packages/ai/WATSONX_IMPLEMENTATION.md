# IBM watsonx.ai Provider Implementation

This document summarizes the implementation of the IBM watsonx.ai provider for @mariozechner/pi-ai.

## Files Changed

### Core Implementation
- **src/types.ts**: Added `watsonx-ai-text-chat` API and `ibm-watsonx` provider
- **src/providers/ibm-watsonx.ts**: Complete provider implementation with streaming support
- **src/providers/register-builtins.ts**: Registered the watsonx provider
- **src/env-api-keys.ts**: Added `WATSONX_AI_APIKEY` environment variable detection
- **src/index.ts**: Exported watsonx provider functions

### Model Generation
- **scripts/generate-models.ts**: Added 4 watsonx models:
  - `ibm/granite-3-3-8b-instruct`
  - `ibm/granite-13b-chat-v2`
  - `meta-llama/llama-3-3-70b-instruct`
  - `mistralai/mistral-large-2`

### Tests
- **test/stream.test.ts**: Added basic test suite for watsonx provider

### Documentation
- **README.md**: 
  - Added watsonx to supported providers list
  - Added environment variable documentation
  - Added setup instructions with example code
- **CHANGELOG.md**: Documented the new feature

## Features Implemented

✅ **Streaming**: Full streaming support with structured events
✅ **Tool Calling**: OpenAI-style function calling support
✅ **Multimodal**: Text and image input support (vision models)
✅ **Error Handling**: Proper error handling and abort support
✅ **Cross-Provider Compatibility**: Message transformation for cross-provider handoffs
✅ **Usage Tracking**: Token usage and cost tracking

## Environment Variables

```bash
WATSONX_AI_APIKEY=your-api-key                          # Required: API key from IBM Cloud
WATSONX_AI_PROJECT_ID=your-project-id                   # Required (or SPACE_ID)
WATSONX_AI_SPACE_ID=your-space-id                       # Alternative to PROJECT_ID
WATSONX_AI_SERVICE_URL=https://us-south.ml.cloud.ibm.com  # Optional: defaults to us-south
```

## Usage Example

```typescript
import { getModel, complete } from '@mariozechner/pi-ai';

// Using environment variables
const model = getModel('ibm-watsonx', 'ibm/granite-3-3-8b-instruct');
const response = await complete(model, {
  messages: [{ role: 'user', content: 'Hello!' }]
});

// Or with explicit configuration
const response2 = await complete(model, {
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  serviceUrl: 'https://us-south.ml.cloud.ibm.com'
});
```

## Architecture Notes

### API Integration
- Uses `@ibm-cloud/watsonx-ai` SDK (v1.7.7)
- Implements `textChatStream` with `returnObject: true` for structured streaming
- Follows OpenAI-style chat completion API patterns

### Message Conversion
- User messages: Support both string and multimodal content (text + images)
- Assistant messages: Text blocks and tool calls
- Thinking blocks: Converted to text with `<thinking>` tags (watsonx doesn't natively support thinking blocks)
- Tool results: Uses "tool" role with tool_call_id

### Tool Format
- OpenAI-style function calling format
- Tools defined with JSON Schema parameters
- Tool calls streamed incrementally with partial JSON parsing

### Token Usage
- Input tokens: `prompt_tokens`
- Output tokens: `completion_tokens`
- Total tokens: `total_tokens`
- Cache tokens: Not supported by watsonx (always 0)

### Stop Reasons
- `stop` / `end_turn` → `"stop"`
- `length` / `max_tokens` → `"length"`
- `tool_calls` → `"toolUse"`
- Default → `"stop"`

## Testing

Run the tests with watsonx credentials:

```bash
export WATSONX_AI_APIKEY="your-api-key"
export WATSONX_AI_PROJECT_ID="your-project-id"
cd packages/ai
npm test -- stream.test.ts
```

The test suite includes:
- Basic text generation
- Tool calling
- Streaming

## Dependencies Added

- `@ibm-cloud/watsonx-ai@^1.7.7`: Official IBM watsonx.ai Node.js SDK

## Future Enhancements

Potential improvements for future versions:

- [ ] Add more watsonx model definitions (once available in models.dev)
- [ ] Support for native thinking/reasoning if watsonx adds it
- [ ] Prompt caching support if watsonx adds it
- [ ] Add to cross-provider handoff tests
- [ ] Add image-specific tests for vision models
- [ ] Add abort handling tests
- [ ] Add context overflow tests
