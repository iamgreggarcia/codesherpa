import { components } from '@/types/openai';
import { OpenAIEndpoints } from '@/constants/openai';
import { getFetchOptions } from '@/utils/app/fetch';
import { createOpenAIStreamTransformer } from './stream-transformer';

/**
 * Type definition for a message used in a chat completion request.
 */
export type Message = components['schemas']['ChatCompletionRequestMessage'];

/**
 * Type definition for a stream response from the OpenAI API.
 */
export type StreamResponse = components['schemas']['CreateChatCompletionStreamResponse']

/**
 * Type definition for a response delta from a stream response.
 */
export type ResponseDelta = components['schemas']['ChatCompletionStreamResponseDelta'];

/**
 * Custom error class for OpenAI API errors.
 */
export class OpenAIError extends Error {
    type: string;
    param: string;
    code: string;

    constructor(message: string, type: string, param: string, code: string) {
        super(message);
        this.name = 'OpenAIError';
        this.type = type;
        this.param = param;
        this.code = code;
    }
}

/**
 * Sends a chat completion request to the OpenAI API and returns a readable stream of response deltas.
 * @param model The ID of the model to use for the request.
 * @param messages An array of messages to use as context for the request.
 * @param functions An object containing the names and bodies of any custom functions to use in the request.
 * @param function_call The name of the function to call, if any.
 * @param max_tokens The maximum number of tokens to generate in the response.
 * @param temperature The sampling temperature to use for generating the response.
 * @param stream Whether to use streaming mode for the request.
 * @param signal An optional AbortSignal to cancel the request.
 * @returns A ReadableStream of response deltas.
 */
export async function OpenAIStream(model: string, messages: Message[], functions?: any, function_call?: string, max_tokens?: number, temperature?: number, stream?: boolean, signal?: AbortSignal): Promise<ReadableStream<string>> {

    const api_url = OpenAIEndpoints.CHAT_COMPLETIONS;
    const fetchOptions = getFetchOptions(model, messages, functions, function_call, max_tokens, temperature, stream, signal);

    let response;
    try {
        response = await fetch(api_url, fetchOptions);
    } catch (error) {
        throw new Error(`Network error: ${(error as Error).message}`);
    }

    if (response.status !== 200) {
        let result;
        try {
            result = await response.json();
        } catch (error) {
            throw new Error(`Response parsing error: ${(error as Error).message}`);
        }
        if (result.error) {
            throw new OpenAIError(
                result.error.message,
                result.error.type,
                result.error.param,
                result.error.code,
            );
        } else {
            const decoder = new TextDecoder();
            throw new Error(
                `OpenAI API returned an error: ${decoder.decode(result?.value) || result.statusText
                }`,
            );
        }
    }

    if (response.body) {
        return response.body.pipeThrough(createOpenAIStreamTransformer());
    } else {
        throw new Error('OpenAI API response body is null');
    }
}