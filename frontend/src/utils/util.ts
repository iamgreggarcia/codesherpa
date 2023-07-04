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
