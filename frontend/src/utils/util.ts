/**
 * Custom error class for OpenAI API errors.
 */
export class OpenAIError extends Error {
    type: string;
    param: string;
    code: string;

    /**
     * Creates an instance of OpenAIError.
     * @param message The error message.
     * @param type The error type.
     * @param param The parameter that caused the error.
     * @param code The error code.
     */
    constructor(message: string, type: string, param: string, code: string) {
        super(message);
        this.name = 'OpenAIError';
        this.type = type;
        this.param = param;
        this.code = code;
    }
}

/**
 * Escapes special characters in a JSON string.
 * @param jsonString The JSON string to escape.
 * @returns The escaped JSON string.
 */
export function escapeJsonString(jsonString: string): string {
    const escapeMap: { [key: string]: string } = {
        '\\': '\\\\',
        '/': '\\/',
        '"': '\\"',
        '\n': '\\n',
        '\r': '\\r',
        '\t': '\\t',
        '\f': '\\f'
    };

    return jsonString.replace(/[\\/"\n\r\t\f]/g, char => escapeMap[char]);
}

/**
 * Descape special characters in a JSON string.
 * @param escapedString The JSON string to descape.
 * @returns The descape JSON string.
 */
export function descapeJsonString(escapedString: string): string {
    const descapeMap: { [key: string]: string } = {
        '\\\\': '\\',
        '\\/': '/',
        '\\"': '"',
        '\\n': '\n',
        '\\r': '\r',
        '\\t': '\t',
        '\\f': '\f'
    };

    return escapedString.replace(/\\\\|\\\/|\\"|\\n|\\r|\\t|\\f/g, char => descapeMap[char]);
}

/**
 * Handles a function call by parsing the function call, determining the endpoint based on the function name,
 * descaping and parsing the arguments, and sending a POST request to the endpoint with the arguments.
 * @param functionCall The function call to handle.
 * @returns The parsed function call response.
 */
export const handleFunctionCall = async (functionCall: string) => {
    let parsedFunctionCallResponse;
    try {
        const parsed = JSON.parse(functionCall);
        let functionName = parsed.function_call.name;
        let functionArgumentsStr = parsed.function_call.arguments;

        // Descape and parse the arguments
        let descapeArgumentsStr = descapeJsonString(functionArgumentsStr);

        // Determine the endpoint based on the functionName
        let endpoint = '';
        if (functionName === 'repl_repl_post') {
            endpoint = '/repl';
        } else if (functionName === 'command_endpoint_command_post') {
            endpoint = '/command';
        }

        const pluginResponse = await fetch(`http://localhost:3333${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: descapeArgumentsStr
        });

        parsedFunctionCallResponse = await pluginResponse.json();
    } catch (error) {
        // not a function call
        // console.error('Error handling function call:', error);
    }

    return parsedFunctionCallResponse;
};