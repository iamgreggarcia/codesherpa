/**
 * Parses the data received from an OpenAI stream and returns a string representation of the parsed data.
 * @param data The data received from the OpenAI stream.
 * @returns A string representation of the parsed data.
 */
import { components } from "@/types/openai";
import { escapeJsonString } from "@/utils/util";

type StreamResponse = components['schemas']['CreateChatCompletionStreamResponse'];

let isFirst = true;

export function parseOpenAIStreamData(data: string): string {
    const dataPrefix = "data: ";
    const events = data.split('\n').filter(event => event.startsWith(dataPrefix));
    
    let results = []; 
    
    for (const event of events) {
        // Trim the prefix to get the data part
        // console.log(event)
        let trimmedEvent = event.trim().substring(dataPrefix.length);

        if (trimmedEvent === "[DONE]") {
            results.push(""); 
            continue;
        }
        
        try {
            // Parse the JSON data
            const jsonData: StreamResponse = JSON.parse(trimmedEvent);

            if (jsonData.choices[0]?.delta?.function_call?.name) {
                isFirst = true;
                //console.log(`{"function_call": {"name": "${jsonData.choices[0]?.delta?.function_call.name}", "arguments": "`)
                results.push(`{"function_call": {"name": "${jsonData.choices[0]?.delta?.function_call.name}", "arguments": "`);
            } else if (jsonData.choices[0]?.delta?.function_call?.arguments) {
                const argumentChunk: string = isFirst ? jsonData.choices[0].delta.function_call.arguments.trim() : jsonData.choices[0].delta.function_call.arguments;
                isFirst = false;
                //console.log(`${escapeJsonString(argumentChunk)}`);
                results.push(`${escapeJsonString(argumentChunk)}`);
            } else if (jsonData.choices[0]?.finish_reason === 'function_call') {
                isFirst = true;
                //console.log('"}}');
                results.push('"}}');
            } else {
                // Adding null check before pushing to results
                if(jsonData.choices[0]?.delta?.content) {
                    //console.log(jsonData.choices[0]?.delta?.content)
                    results.push(jsonData.choices[0]?.delta?.content);
                }
                isFirst = true;
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.error("JSON data:", trimmedEvent);
        }
    }
    
    // Adding a condition to check if the results array is not empty to prevent returning an undefined object.
    return results.length > 0 ? results.join('') : "";
}
