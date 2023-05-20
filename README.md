# CodeSherpa

CodeSherpa is a Python code-interpreter ChatGPT plugin, specifically designed to execute Python code and run commands locally in an isolated Docker container.

<https://user-images.githubusercontent.com/16596972/236653720-945cfae8-6183-4c4b-bb5c-86663a0a06a6.MP4>

## Features

Have ChatGPT:

- Execute Python in an isolated Docker container, maintaining the state between requests.
- Run terminal commands

## Installation

1. Install Python 3.10, if not already installed.
2. Clone the repository: `git clone https://github.com/iamgreggarcia/codesherpa.git`
3. Navigate to the cloned repository directory: `cd /path/to/codesherpa`

## Running the Plugin Locally with Docker

1. Build and run the Docker image locally: `make dev`. CodeSherpa will then spring to life at `localhost:3333`.
2. Navigate to the ChatGPT UI, and access the plugin store.
3. Select "Develop your own plugin".
4. Enter `localhost:3333`

## API Endpoints

### POST `/repl`

Executes the provided Python code in a REPL-like environment, maintaining the state between requests, and returns the output or error message.

#### Request Body

| Parameter | Type   | Description                                                      |
|-----------|--------|------------------------------------------------------------------|
| code      | string | The Python code to be executed in the REPL-like environment.     |

#### Response

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| result    | string | The output of the executed code.      |
| error     | string | Error message if there is an error.   |

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

## Usage

To interact with the CodeSherpa API, use HTTP requests to the corresponding endpoints. For example, to execute Python code in the REPL-like environment, send a POST request to the `/repl` endpoint with a JSON object containing the `code` key and the Python code as a string.

Here's an example:

```json
{
  "code": "import pandas as pd\nimport numpy as np\nnp.random.seed(0)\ndf = pd.DataFrame({'A': np.random.rand(100), 'B': np.random.rand(100)})\ndf['target'] = df['A'] + 2*df['B']\ndf.head()"
}
```
And here's ChatGPT executing the code:

<https://user-images.githubusercontent.com/16596972/236653729-5f922402-b538-4c92-a299-64a57a57d141.MP4>


To run terminal commands, send a POST request to the `/command` endpoint with a JSON object containing the `command` key and the terminal command to execute.

For example:

```json
{
  "command": "echo \"Hello, terminal!\""
}
```

## Contributing

I welcome contributions! If you have an idea for a feature, or want to report a bug, please open an issue, or submit a pull request.

Steps to contribute:

1. Fork this repository. 
2. Create a feature branch `git checkout -b feature/YourAmazingIdea`.
3. Commit your changes `git commit -m 'Add YourAmazingIdea'`.
4. Push to the branch `git push origin feature/YourAmazingIdea`.
5. Submit a Pull Request.

## Future Work

Alright, dear reader, here's the deal. I've built CodeSherpa, this Python interpreter-ChatGPT-plugin creature that runs inside Docker like a hamster on a wheel. It's neat, but very much a local(host) affair. Think charming neighborhood coffee shop, not Starbucks.

Scaling this into a full-blown, resource-intensive production version? A tall order. But I'm working on a lightweight version that can ideally be installed by anyone with ChatGPT Plugin access.

It'll swap Docker for an existing Compiler API (which can support multiple languages), acting more like a nimble, stateless code sidekick than a full-blown REPL. It'll be a bit more limited, but it'll be a start.
## License

This project is licensed under the terms of the MIT license.
