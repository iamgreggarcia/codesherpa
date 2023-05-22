# CodeSherpa

CodeSherpa is a multi-language code-interpreter ChatGPT plugin. It's designed to execute code and run commands locally in a Docker container.

<https://github.com/iamgreggarcia/codesherpa/assets/16596972/a42d717c-a996-4622-a5d1-139466cad233>

## Recent Updates

- **May 22, 2023**: Refactored README to provide clear and concise instructions for building and running CodeSherpa.
- **May 20, 2023**: CodeSherpa now supports multiple programming languages, including Python, C++, and Rust.

## Features

CodeSherpa allows you to:
- Execute code within a Docker container, maintaining the state between requests. Supported languages include Python, C++, and Rust.
- Run terminal commands

## Prerequisites

Before installing CodeSherpa, ensure you have the following software installed on your system:
- Python 3.10
- Docker

## Installation

You can install CodeSherpa in one of the two ways: by pulling the Docker image from Github Packages or by cloning the repository.

### Option 1: Pull the Docker image from Github Packages

```bash
docker pull ghcr.io/iamgreggarcia/codesherpa:latest
```

### Option 2: Clone the repository

1. Clone the repository: 

```bash
git clone https://github.com/iamgreggarcia/codesherpa.git
```

2. Navigate to the repository directory: 

```bash
cd codesherpa
```

## Building and Running CodeSherpa

After installation, you can build and run CodeSherpa using either the provided `make` commands or directly using Docker.

### Option 1: Using `make` commands

1. Build the Docker image:

```bash
make build-docker
```

2. Run the Docker image locally:

```bash
make run-docker-localserver
```

CodeSherpa will then be accessible at [localhost:3333](http://localhost:3333).

### Option 2: Using Docker directly

If you cloned the repository, follow these steps:

1. Build the Docker image:

```bash
docker build -t codesherpa .
```

2. Run the Docker image locally:

```bash
docker run -p 3333:3333 codesherpa python3 -c "import localserver.main; localserver.main.start()"
```

After successfully running the above commands, CodeSherpa will be available at [localhost:3333](http://localhost:3333).

## Connecting CodeSherpa to ChatGPT

1. Navigate to the ChatGPT UI, and access the plugin store.
2. Select "Develop your own plugin".
3. In the plugin URL input, enter `localhost:3333`. Your ChatGPT should now be able to use CodeSherpa's features.

## API Endpoints

### POST `/repl`

Executes the provided code is the specified language, maintaining the state between requests, and returns the output or error message.

#### Request Body

| Parameter | Type   | Description                                                      |
|-----------|--------|------------------------------------------------------------------|
| code      | string | The code to be executed.            |
| language  | string | The programming language of the code to be executed.             |

#### Supported Languages

| Language | Language Parameter |
|----------|--------------------|
| Python   | python             |
| C++      | c++                |
| Rust     | rust               |

#### Response

**HTTP 200**

| Parameter | Type   | Description                           |
|-----------|--------|---------------------------------------|
| result    | string | The output of the executed code.      |

**HTTP 400**

| Parameter  | Type    | Description                           |
|------------|---------|---------------------------------------|
| error      | string  | A brief description of the error.     |
| returnCode | integer | The return code of the failed process.|
| command    | string  | The command that was attempted.       |
| output     | string  | Any output that resulted from the attempted command. |

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

To interact with the CodeSherpa API, use HTTP requests to the corresponding endpoints. To execute some code code, send a POST request to the `/repl` endpoint with a JSON object containing the `code` key and the `language` key.

For example, here's a request to plot a vector field on a sphere using Python:

```json
{
  "code": "import numpy as np\nimport matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\n\n# Define the number of vectors along each dimension\nn_vectors = 20\n\n# Define the sphere\nphi = np.linspace(0, np.pi, n_vectors)\ntheta = np.linspace(0, 2 * np.pi, n_vectors)\nphi, theta = np.meshgrid(phi, theta)\nx = np.sin(phi) * np.cos(theta)\ny = np.sin(phi) * np.sin(theta)\nz = np.cos(phi)\n\n# Define the vector field\nvx = np.sin(phi) * np.cos(theta)\nvy = np.sin(phi) * np.sin(theta)\nvz = np.cos(phi)\n\n# Create the figure\nfig = plt.figure(figsize=(8, 8))\nax = fig.add_subplot(111, projection='3d')\n\n# Plot the sphere surface\nax.plot_surface(x, y, z, color='b', alpha=0.3)\n\n# Plot the vector field\nax.quiver(x, y, z, vx, vy, vz, length=0.1, normalize=True)\n\n# Set the aspect ratio\nax.set_box_aspect([1, 1, 1])\n\nplt.savefig('static/images/vector_field.png')",
  "language": "python"
}
```

And here's ChatGPT send the request to CodeSherpa:

<https://github.com/iamgreggarcia/codesherpa/assets/16596972/1ae9cbda-1f83-4986-9b2f-ea4e2f1d76f1>

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

So I've built CodeSherpa, this Python interpreter-ChatGPT-plugin creature that runs inside Docker like a hamster on a wheel. It's neat, but very much a local(host) affair. Think charming neighborhood coffee shop, not Starbucks.

Scaling this into a full-blown, resource-intensive production version? A tall order. But I'm working on a lightweight version that can ideally be installed by anyone with ChatGPT Plugin access.

It'll swap Docker for an existing compiler API (which can support multiple languages), acting more like a nimble, stateless code sidekick than a full-blown REPL. It'll be a bit more limited, but a start. Again I'm very open to contributions, so if you have an idea, please open an issue or submit a pull request.

## License

This project is licensed under the terms of the MIT license.
