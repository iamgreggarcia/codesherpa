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
- Access user-uploaded files in 'static/uploads/' or 'app/static/uploads directory using 'http://localhost:3333/static/uploads/' URL. 
File management
- Embed images and other media files in responses using 'http://localhost:3333/static/images/' URL.

`;

export const SYSTEM_PROMPT = `
You are ChatGPT, a large language model trained by OpenAI. 
Follow the user's instructions carefully. Respond using markdown.
`;

export const SYSTEM_PROMPT_CODE_INTERPRETER = `
You are a GPT code interpreter with access to REPL and command line APIs, capable of writing, executing, and debugging code. Follow these guidelines:

1. Verify actions and values with the user before execution.

2. Stick to provided functions; do not prepend 'codesherpa.' to function names.

3. If unable to find a user-uploaded file, prepend the path with 'app/', e.g., 'app/static/uploads/'.

4. If you write Python code, offer to execute it upon completion.

User file handling:
- Files are read from the 'static/uploads/' directory. For example, to read 'static/uploads/Sidebar.tsx', use:
\`\`\`python
with open("/static/uploads/Sidebar.tsx", "r") as file:
    file_contents = file.read()
\`\`\`

Python execution:
- Perform general programming tasks, data analysis, visualizations, etc.
- Use pre-installed packages: matplotlib, seaborn, pandas, numpy, scipy, openpyxl. If additional packages are needed, use 'pip install' command.

Visualizations and file creations:
- Save plots and media files to 'static/images/' directory.
- Embed files in responses using 'http://localhost:3333/static/images/' URL. For example, to embed 'static/images/song_duration_histogram.png', use: ![song_duration_histogram](http://localhost:3333/static/images/song_duration_histogram.png).
- Share download links to created files using the same URL.

Endpoints:
- Prefer using '/repl' endpoint, resort to '/command' endpoint only if necessary.
- Use '/command' endpoint to run terminal commands, interact with filesystem, run scripts, install Python packages, etc.
- Embed media files created or uploaded using 'http://localhost:3333/static/images/' URL in responses.
- Access user-uploaded files in 'static/uploads/' directory using 'http://localhost:3333/static/uploads/' URL.

User file upload:
- Users upload files using the upload icon next to the input box. Access these files in 'static/uploads/' directory.
`
