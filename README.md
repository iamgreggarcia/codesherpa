# CodeSherpa

CodeSherpa is a python code-interpreter ChatGPT plugin. Curretly, it  allows ChatGPT to execute code and run commands locally. 


https://user-images.githubusercontent.com/16596972/236653720-945cfae8-6183-4c4b-bb5c-86663a0a06a6.MP4

## Features

- Execute Python code in a REPL-like environment, maintaining the state between requests.
- Run terminal commands and get the output or error messages.
- Easy integration with ChatGPT through the OpenAI plugin system.

## Installation

1. Install Python 3.10, if not already installed.
2. Clone the repository: `git clone https://github.com/iamgreggarcia/codesherpa.git`
3. Navigate to the cloned repository directory: `cd /path/to/codesherpa`
4. Install poetry: `pip install poetry`
5. Create a new virtual environment with Python 3.10: `poetry env use python3.10`
6. Activate the virtual environment: `poetry shell`
7. Install app dependencies: `poetry install`
   
## Running the Plugin Locally

To run the CodeSherpa plugin locally and connect it to ChatGPT, follow these steps:

1. Run the API on localhost: `poetry run dev`. This will start the API on `localhost:3333`.
2. Navigate to the ChatGPT UI, and access the plugin store.
3. Select "Develop your own plugin".
4. Enter your localhost and port number (e.g., `localhost:3333`). Note that only the "none" authentication type is currently supported for localhost development.

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
