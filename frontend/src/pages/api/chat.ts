import { OpenAIStream } from '@/utils/services/openai/openai-stream'
import { FUNCTIONS } from '@/constants/const';

export const config = {
  runtime: 'edge',
};

/**
 * Handler function for the chat API endpoint.
 * @param req - The incoming request object.
 * @returns A response object with the OpenAIStream data or an error message.
 */
const handler = async (req: Request): Promise<Response> => {
  const { messages, model, signal } = await req.json();
  const function_call = 'auto';
  const max_tokens = Infinity;
  const temperature = 0.8;
  const stream = true;

  try {
    const openAIStream = await OpenAIStream(model, messages, FUNCTIONS, function_call, max_tokens, temperature, stream, signal);

    if (openAIStream.locked) {
      // The stream is empty
      return new Response('No data', { status: 204 });
    }

    return new Response(openAIStream, { headers: { 'Content-Type': 'text/event-stream' } });

  } catch (error: unknown) {
    console.log(error);
    return new Response('Error', { status: 500, statusText: (error as Error).message });
  }
}

export default handler;