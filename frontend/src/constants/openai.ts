import { OpenAPIV3 } from 'openapi-types';
import openapi from '@/utils/services/plugin-protocol/openapi.json';

/**
 * Interface representing a mapping of operation IDs to their corresponding paths.
 */
interface PathMap {
  [key: string]: string;
}

/**
 * Creates a mapping of operation IDs to their corresponding paths from an OpenAPI document.
 * @param apiDocument The OpenAPI document to create the mapping from.
 * @returns The mapping of operation IDs to their corresponding paths.
 */
const createOperationIdToPathMap = (apiDocument: OpenAPIV3.Document): PathMap => {
  const pathMap: PathMap = {};

  for (const path in apiDocument.paths) {
    for (const method in apiDocument.paths[path]) {
      const operation = apiDocument.paths[path]?.[method as OpenAPIV3.HttpMethods];
      if (operation && operation.operationId) {
        pathMap[operation.operationId] = path;
      }
    }
  }

  return pathMap;
};

/**
 * The mapping of operation IDs to their corresponding paths.
 */
export const pathMap = createOperationIdToPathMap(openapi as OpenAPIV3.Document);


/**
 * Returns the server URL from an OpenAPI document.
 * @param apiDocument The OpenAPI document to retrieve the server URL from.
 * @returns The server URL, or undefined if not found.
 */
const getServerUrl = (apiDocument: OpenAPIV3.Document): string | undefined => {
  return apiDocument.servers && apiDocument.servers.length > 0 ? apiDocument.servers[0].url : undefined;
};

/**
 * The server URL for the OpenAPI specification.
 */
export const serverUrl: string | undefined = getServerUrl(openapi as OpenAPIV3.Document); 

/**
 * Enum representing the different base GPT models available.
 */
export enum OpenAIBaseModel {
  GPT3_5 = 'GPT-3.5',
  GPT4 = 'GPT-4',
}

/**
 * Enum representing the different GPT models available.
 */
export enum Model {
  GPT4 = "GPT-4",
  GPT4_0613 = "GPT-4-0613",
  GPT4_CODE_INTERPRETER = "GPT-4 Code Interpreter",
  GPT3_5_TURBO_0613 = "GPT-3.5-Turbo-0613",
  GPT3_5_TURBO_16K_0613 = "GPT-3.5-turbo-16k-0613",
  GPT3_5_CODE_INTERPRETER_16K = "GPT-3.5 Code Interpreter",
}


/**
 * Interface representing information about an OpenAI model.
 */
interface ModelInfo {
  name: string;
}


export const modelMap: Record<Model, ModelInfo> = {
  [Model.GPT4]: {
    name: "gpt-4",
  },
  [Model.GPT4_0613]: {
    name: "gpt-4-0613",
  },
  [Model.GPT4_CODE_INTERPRETER]: {
    name: "gpt-4-0613",
  },
  [Model.GPT3_5_TURBO_0613]: {
    name: "gpt-3.5-turbo-0613",
  },
  [Model.GPT3_5_TURBO_16K_0613]: {
    name: "gpt-3.5-turbo-16k-0613",
  },
  [Model.GPT3_5_CODE_INTERPRETER_16K]: {
    name: "gpt-3.5-turbo-16k-0613",
  }
}

/**
 * The base URL for the OpenAI API.
 */
export const OpenAIAPI = 'https://api.openai.com/v1';

/**
 * Endpoints for the OpenAI API.
 */
export const OpenAIEndpoints = {
  CHAT_COMPLETIONS: `${OpenAIAPI}/chat/completions`,
  COMPLETIONS: `${OpenAIAPI}/completions`,
  EDITS: `${OpenAIAPI}/edits`,
  IMAGES_GENERATIONS: `${OpenAIAPI}/images/generations`,
  IMAGES_EDITS: `${OpenAIAPI}/images/edits`,
  IMAGES_VARIATIONS: `${OpenAIAPI}/images/variations`,
  EMBEDDINGS: `${OpenAIAPI}/embeddings`,
  AUDIO_TRANSCRIPTIONS: `${OpenAIAPI}/audio/transcriptions`,
  AUDIO_TRANSLATIONS: `${OpenAIAPI}/audio/translations`,
  FILES: `${OpenAIAPI}/files`,
  FILES_CONTENT: `${OpenAIAPI}/files/{file_id}/content`,
  FINE_TUNES: `${OpenAIAPI}/fine-tunes`,
  FINE_TUNES_CANCEL: `${OpenAIAPI}/fine-tunes/{fine_tune_id}/cancel`,
  FINE_TUNES_EVENTS: `${OpenAIAPI}/fine-tunes/{fine_tune_id}/events`,
  MODELS: `${OpenAIAPI}/models`,
  MODELS_SPECIFIC: `${OpenAIAPI}/models/{model}`,
  MODERATIONS: `${OpenAIAPI}/moderations`,
} as const;

/**
 * Type representing an OpenAI API endpoint.
 */
export type OpenAIEndpoint = keyof typeof OpenAIEndpoints;

/**
 * The system prompt for codesherpa.
 */
export const _SYSTEM_PROMPT_CODE_INTERPRETER = `
Do not make assumptions about which functions to run or which values to use. Always verify with the user.
Only use the functions you have been provided with. Do not prepend \`codesherpa.\` to the function names.

A plugin for interactive code execution, file management, and shell command execution.
'/repl' endpoint
- Execute Python code interactively for general programming, tasks, data analysis, visualizations, and more.
- Pre-installed packages: matplotlib, seaborn, pandas, numpy, scipy, openpyxl.
- results that don't have a value will have a content value of 'result: \"ok\"' 
'/command' endpoint
- Run terminal commands and interact with the filesystem, run scripts, and more.
- Embed media files created or uploaded using 'http://localhost:3333/static/images/' URL in responses.
- Users can upload files by clicking the upload icon next to the input box. 
- When a user uploads a dataset (.csv, .xlsx, etc.), immediately do basic data analysis and visualization and embed the results in the response. For example, if a user uploads a .csv file, immediately describe the contents, and provide an insight of the data with a visualization.   Always give a visual representation of the data in the initial response.
- Access user-uploaded files in 'static/uploads/' directory using 'http://localhost:3333/static/uploads/' URL. 
File management
- Embed images and other media files in responses using 'http://localhost:3333/static/images/' URL.
- Access user-uploaded files in 'static/uploads/'
`;

export const SYSTEM_PROMPT = `
You are ChatGPT, a large language model trained by OpenAI. 
Follow the user's instructions carefully. Respond using markdown.
`;

export const SYSTEM_PROMPT_CODE_INTERPRETER = `
// Do not make assumptions about which functions to run or which values to use. Always verify with the user.
Only use the functions you have been provided with. Do not prepend \`codesherpa.\` to the function names.

// You are a GPT code interpreter. You have access to a REPL API and a command line API. You can write, execute, and debug code on behalf of the user. 
// If you write Python code, you can try to execute it when asked by the user. If you write a python code snippet, when finished, ask the user if you should execute it.
// \`/repl\` endpoint
// - Execute Python code interactively for general programming, tasks, data analysis, visualizations, and more.
// - Verify your present working directory by running \`pwd\` command. If you can't find a file, it's probably because you are in the wrong directory.
// - Pre-installed packages: matplotlib, seaborn, pandas, numpy, scipy, openpyxl.If you need to install additional packages, use the \`pip install\` command.
// - When a user asks for visualization, save the plot to \`static/images/\` directory, and embed it in the response using \`http://localhost:3333/static/images/\` URL.
// - Always save alls media files created to \`static/images/\` directory, and embed them in responses using \`http://localhost:3333/static/images/\` URL.
// - Share download links to files created in \`static/images/\` (or \`static/uploads/\`) directory using \`http://localhost:3333/static/images/\` URL.

// - Read uploaded files from \`static/uploads/\` directory, e.g.,if a user uploads a file \`static/uploads/Sidebar.tsx\`, first try to read the file contents using the following code: 
\`\`\`python
with open("/static/uploads/Sidebar.tsx", "r") as file:
file_contents = file.read()
file_contents
\`\`\`
// You can try the \`/command\` endpoint to read the file contents.
// \`/command\` endpoint
// - Run terminal commands and interact with the filesystem, run scripts, and more.
// - Install python packages using \`pip install\` command.
// - Always embed media files created or uploaded using \`http://localhost:3333/static/images/\` URL in responses.
// - Access user-uploaded files in\`static/uploads/\` directory using \`http://localhost:3333/static/uploads/\` URL.
// File management
// Users can upload files by clicking the upload icon next to the input box. 
// - Access user-uploaded files in \`static/uploads/\`

// Exexute code.
// Note: This endpoint current supports a REPL-like environment for Python only.
// Args:
// request (CodeExecutionRequest): The request object containing the code to execute.
// Returns:
// CodeExecutionResponse: The result of the code execution.
type repl_repl_post = (_: {
language: string,
code: string,
}) => any;

// Run commands.
// Args:
// command_request (CommandExecutionRequest): The request object containing the command to execute.
// Returns:
// CommandExecutionResponse: The result of the command execution.
type command_endpoint_command_post = (_: {
command: string,
}) => any;
`
