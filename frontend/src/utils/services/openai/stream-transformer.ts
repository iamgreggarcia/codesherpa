import { parseOpenAIStreamData } from '@/utils/services/openai/parser';

/**
 * Creates a TransformStream that decodes incoming chunks of data, parses them using the OpenAI parser,
 * and enqueues the resulting response as an encoded chunk.
 * @returns {TransformStream} The created TransformStream.
 */
export function createOpenAIStreamTransformer(): TransformStream {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new TransformStream({
    async transform(chunk, controller) {
      try {
        const data = decoder.decode(chunk);
        const response = parseOpenAIStreamData(data);
        if (response) {
          controller.enqueue(encoder.encode(response));
        }
      } catch (error) {
        console.error(`Error in OpenAI stream transformer: ${error}`);
        controller.error(error);
      }
    }
  });
}