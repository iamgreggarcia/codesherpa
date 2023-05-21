# CodeSherpa

CodeSherpa is a multi-language code-interpreter ChatGPT plugin, designed to execute code and run commands locally in an isolated Docker container.

## Updates

- **May 20, 2023**: CodeSherpa now supports multiple programming languages including Python, C++, and Rust.

## Features

Have ChatGPT:

- Execute code in an isolated Docker container, maintaining the state between requests. Supported languages include Python, C++, and Rust.
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

Executes the provided code in a REPL-like environment, maintaining the state between requests, and returns the output or error message.

#### Request Body

| Parameter | Type   | Description                                                      |
|-----------|--------|------------------------------------------------------------------|
| code      | string | The code to be executed in the REPL-like environment.            |
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

To interact with the CodeSherpa API, use HTTP requests to the corresponding endpoints. To execute code in the REPL-like environment, send a POST request to the `/repl` endpoint with a JSON object containing the `code` key and the `language` key.

For example, here's a request to plot a vector field on a sphere using Python:

```json
{
  "code": "import numpy as np\nimport matplotlib.pyplot as plt\nfrom mpl_toolkits.mplot3d import Axes3D\n\n# Define the number of vectors along each dimension\nn_vectors = 20\n\n# Define the sphere\nphi = np.linspace(0, np.pi, n_vectors)\ntheta = np.linspace(0, 2 * np.pi, n_vectors)\nphi, theta = np.meshgrid(phi, theta)\nx = np.sin(phi) * np.cos(theta)\ny = np.sin(phi) * np.sin(theta)\nz = np.cos(phi)\n\n# Define the vector field\nvx = np.sin(phi) * np.cos(theta)\nvy = np.sin(phi) * np.sin(theta)\nvz = np.cos(phi)\n\n# Create the figure\nfig = plt.figure(figsize=(8, 8))\nax = fig.add_subplot(111, projection='3d')\n\n# Plot the sphere surface\nax.plot_surface(x, y, z, color='b', alpha=0.3)\n\n# Plot the vector field\nax.quiver(x, y, z, vx, vy, vz, length=0.1, normalize=True)\n\n# Set the aspect ratio\nax.set_box_aspect([1, 1, 1])\n\nplt.savefig('static/images/vector_field.png')",
  "language": "python"
}
```
And here's ChatGPT executing the code:



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
