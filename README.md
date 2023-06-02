# CodeSherpa

CodeSherpa is a code interpreter ChatGPT plugin. It's designed to execute code and run commands locally in a Docker container. It primarily emulates a Python REPL. It also executes Rust and C++. Read the [Quickstart section](#quickstart) to try it out.

### Disclaimer

#### 🚨 Allowing ChatGPT to execute code could be dangerous. 
First and foremost, beware the perils of code execution. While this ChatGPT plugin can be delightfully playful and curious, akin to a newborn puppy exploring its world, this endearing trait also implies it might chew on your favorite slippers—or worse, execute code that wasn't meant to be run. **Always run the plugin in a Docker container, not on your host machine.**

Here's a highlight reel demonstrating what you can do.. See more [examples here](#examples)


https://github.com/iamgreggarcia/codesherpa/assets/16596972/b7afb034-6b74-42a3-9496-a912bcaf0f66




## Recent Updates
- **May 31, 2023**: Introduced new file upload interface via `upload.html` and corresponding server endpoint, allowing you to upload files at `localhost:3333/upload` or by telling ChatGPT you want to upload a file or have a file you want to work with: ![upload-demo](https://github.com/iamgreggarcia/codesherpa/assets/16596972/bb1bcadf-7152-44fb-becb-f571094cbf56) Refactored Python code execution using `ast` module for enhanced efficiency. Local server and manifest file updates to support these features. Minor updates to REPL execution, error handling, and code formatting.
- **May 22, 2023**: Refactored README to provide clear and concise instructions for building and running CodeSherpa.
- **May 20, 2023**: CodeSherpa now supports multiple programming languages, including Python, C++, and Rust.

## Quickstart

### Prerequisites

Ensure the following software is installed on your system:

- Python 3.10
- Docker

### Installation and Running CodeSherpa

Here are the steps to get CodeSherpa up and running swiftly:

**Option 1: Using Docker image from Github Packages**

```bash
# Pull the Docker image
docker pull ghcr.io/iamgreggarcia/codesherpa:latest

# Run the Docker image locally
docker run -p 3333:3333 ghcr.io/iamgreggarcia/codesherpa:latest python3 -c "import localserver.main; localserver.main.start()"
```

**Option 2: Using the repository and Make commands**

```bash
# Clone the repository
git clone https://github.com/iamgreggarcia/codesherpa.git

# Navigate to the repository directory
cd codesherpa

# Build the Docker image using Make
make build-docker

# Run the Docker image locally
make run-docker-localserver
```

**Option 3: Using the repository and Docker commands**

Instead of Make commands, you can use the following Docker commands directly:

```bash
# Clone the repository
git clone https://github.com/iamgreggarcia/codesherpa.git

# Navigate to the repository directory
cd codesherpa

# Build the Docker image
docker build -t codesherpa .

# Run the Docker image locally
docker run -p 3333:3333 codesherpa python3 -c "import localserver.main; localserver.main.start()"
```

Whichever option you choose, CodeSherpa will be accessible at [localhost:3333](http://localhost:3333).

### Connecting CodeSherpa to ChatGPT

1. Navigate to the ChatGPT UI, and access the plugin store.
2. Select "Develop your own plugin".
3. In the plugin URL input, enter `localhost:3333`. Your ChatGPT should now be able to use CodeSherpa's features.

For more detailed information on API endpoints, usage, contributing, future work, and license, refer to the respective sections below.

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

## Examples

Below are some examples. Please note that portions of these videos are edited and/or sped up for brevity.

### Ploting a vector field on a sphere creating an animated gif (short):
https://github.com/iamgreggarcia/codesherpa/assets/16596972/a42d717c-a996-4622-a5d1-139466cad233

### Demo of the Demo: Recreating the ChatGPT Code Interpreter Video Demo
Most of us have seen the [ChatGPT Code Interpreter Video Demo](https://openai.com/blog/chatgpt-plugins#code-interpreter), which is the inspiration for this project. So I thought it fitting to ask similar questions as those in the OpenAI video demo.

- Asking about properties of the function `1/sin(x)`:


https://github.com/iamgreggarcia/codesherpa/assets/16596972/111e7e25-a5b0-4d7e-9ffb-dee5e844cafd


- Uploading a [music.csv](https://corgis-edu.github.io/corgis/csv/music/) dataset for analysis and visualization. [View the ChatGPT conversation](https://chat.openai.com/share/ee480269-ee72-4104-a1fa-2f11e881055b)



https://github.com/iamgreggarcia/codesherpa/assets/16596972/5e9a3b6a-b004-434b-aaba-715d7d53e54d


## Contributing

I welcome contributions! If you have an idea for a feature, or want to report a bug, please open an issue, or submit a pull request.

Steps to contribute:

1. Fork this repository.
2. Create a feature branch `git checkout -b feature/YourAmazingIdea`.
3. Commit your changes `git commit -m 'Add YourAmazingIdea'`.
4. Push to the branch `git push origin feature/YourAmazingIdea`.
5. Submit a Pull Request.

## Future Work
Unsure! I'll keep working on it in my spare time for now. I may try to hack together a much more secure version that can be submitted for review to the plugin store. 

## License

This project is licensed under the terms of the MIT license.
