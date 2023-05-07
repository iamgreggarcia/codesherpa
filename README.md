# CodeSherpa

CodeSherpa is a code-interpreter ChatGPT plugin, built using FastAPI. This tool helps ChatGPT execute code snippets and run commands, all within a Docker container.


https://user-images.githubusercontent.com/16596972/236653720-945cfae8-6183-4c4b-bb5c-86663a0a06a6.MP4

## Features

- Execute Python code in a REPL-like environment, maintaining the state between requests.
- Run terminal commands and get the output or error messages.
- Easy integration with ChatGPT through the OpenAI plugin system.

## Installation

Before running the CodeSherpa plugin, make sure you have the following dependencies installed:

- Docker
- docker-compose

To set up and run the CodeSherpa plugin, follow these steps:

1. Clone the GitHub repository:

```bash
git clone https://github.com/your_username/CodeSherpa.git
```

2. Navigate to the project's root directory:

```bash
cd CodeSherpa
```

3. Run the docker-compose command to build and run the application:

```bash
docker-compose up --build
```

4. The CodeSherpa API will be running on port 8000. You can access the API at `http://localhost:8000`.

## Running the Plugin Locally

To run the CodeSherpa plugin locally and connect it to ChatGPT, follow these steps:

1. Ensure the CodeSherpa API is running on your local machine (refer to the Installation section in this README).
2. Navigate to the ChatGPT UI, and access the plugin store.
3. Select "Develop your own plugin".
4. Enter your localhost and port number (e.g., `localhost:8000`). Note that only the "none" authentication type is currently supported for localhost development.

For more detailed guidance on running a plugin locally and connecting it to ChatGPT, please refer to the [OpenAI Documentation](https://platform.openai.com/docs/plugins/getting-started/running-a-plugin).


## Usage

To interact with the CodeSherpa API, use HTTP requests to the corresponding endpoints. For example, to execute Python code in the REPL-like environment, send a POST request to the `/repl` endpoint with a JSON object containing the `code` key and a list of strings representing the individual lines of Python code.

Use the FastAPI interactive docs to test the API endpoints. To access the interactive docs, navigate to `http://localhost:8000/docs` in your browser.

To run terminal commands, send a POST request to the `/command` endpoint with a JSON object containing the `command` key and the terminal command to execute.

## Example
Generate sample data using the `/repl` endpoint

```json
{
  "code": [
    "import pandas as pd",
    "import numpy as np",
    "np.random.seed(0)",
    "df = pd.DataFrame({",
    "    'A': np.random.rand(100),",
    "    'B': np.random.rand(100)",
    "})",
    "df['target'] = df['A'] + 2*df['B']",
    "df.head()"
  ]
}
```
Here's an example of the same request being made by ChatGPT:


https://user-images.githubusercontent.com/16596972/236653729-5f922402-b538-4c92-a299-64a57a57d141.MP4



## API Endpoints

### POST `/repl`

Executes the provided Python code in a REPL-like environment, maintaining the state between requests, and returns the output or error message.

#### Request Body

| Parameter | Type  | Description                                                      |
|-----------|-------|------------------------------------------------------------------|
| code      | array | A list of strings representing individual lines of Python code. |

#### Response

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| result    | string | The output of the executed code.      |
| error     | string | Error message if there is an error.   |
| suggestion| string | Suggestion for the user if available. |

### POST `/command`

Runs the provided terminal command and returns the output or error message.

#### Request Body

| Parameter | Type   | Description                      |
|-----------|--------|----------------------------------|
| command   | string | The terminal command to execute. |

#### Response

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| result    | string | The output of the executed command.   |
| error     | string | Error message if there is an error.   |


## License

This project is licensed under the terms of the MIT license.
