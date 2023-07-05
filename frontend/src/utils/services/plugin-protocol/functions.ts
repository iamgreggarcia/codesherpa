import openApiSpec from './openapi.json';

export const FUNCTIONS: Array<any> = [
    {
      "name": "repl_repl_post",
      "description": "Exexute code. Note: This endpoint current supports a REPL-like environment for Python only. Args: request (CodeExecutionRequest): The request object containing the code to execute. Returns: CodeExecutionResponse: The result of the code execution.",
      "parameters": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string",
            "example": "python"
          },
          "code": {
            "type": "string",
            "example": "print('Hello, World!')"
          }
        },
        "required": ["language", "code"]
      }
    },
    {
      "name": "command_endpoint_command_post",
      "description": "Run commands. Args: command_request (CommandExecutionRequest): The request object containing the command to execute. Returns: CommandExecutionResponse: The result of the command execution.",
      "parameters": {
        "type": "object",
        "properties": {
          "command": {
            "type": "string",
            "example": "ls -la"
          }
        },
        "required": ["command"]
      }
    }
  ];

