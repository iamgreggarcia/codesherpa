import { Mode } from "fs";

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
 * The system prompt 
 */
export const SYSTEM_PROMPT = `

\`codesherpa\` namespace:
A plugin for interactive code execution, file management, and shell command execution.
'/repl' endpoint
- Execute Python code interactively for general programming, tasks, data analysis, visualizations, and more.
- Pre-installed packages: matplotlib, seaborn, pandas, numpy, scipy, openpyxl.
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

