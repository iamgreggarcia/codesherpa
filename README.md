# CodeSherpa

CodeSherpa is a code interpreter ChatGPT plugin. It's designed to execute code and run commands locally in a Docker container. Read the [Quickstart section](#quickstart) to try it out.

### Disclaimer

#### 🚨 Allowing ChatGPT to execute code could be dangerous. 
First and foremost, beware the perils of code execution. While this ChatGPT plugin can be delightfully playful and curious, akin to a newborn puppy exploring its world, this endearing trait also implies it might chew on your favorite slippers—or worse, execute code that wasn't meant to be run. **Always run the plugin in a Docker container, not on your host machine.**

Here's a highlight reel demonstrating what you can do.. See more [examples here](#examples)


https://github.com/iamgreggarcia/codesherpa/assets/16596972/b7afb034-6b74-42a3-9496-a912bcaf0f66




## Recent Updates
- **June 21, 2023**: 
    - The ChatGPT plugin servic will now fetch the `openapi.json` generated be the server. Also added [request example data](https://fastapi.tiangolo.com/tutorial/schema-extra-example/) which is included in the api spec. This reduces the size of the plugin manifest `description_for_model`.
    - Updated the README section on future work. 
- **June 18, 2023**: Added `docker-compose.yml`
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


## Future Work

### Standalone Code Interpreter
The new [`functions`](https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions) parameter in the latest GPT models (`gpt-4-0613`, `gpt-3.5-turbo-16k-0613`, and `gpt-4-32k-0613` which I don't have access to 🙄) effectively unlocks the capability to build your own "plugin service", similar to ChatGPT Plugins.

As such, I want to make a standalone version of **codesherpa** that doesn't require plugin developer access, loggin into ChatGPT, etc., only an API. 

I've already translated the `openapi.json` spec into a `functions` parameter for the relevant endpoints using a simple tool called **[Func-it](https://github.com/iamgreggarcia/funcit)**


 It transforms your openapi spec into a drop-in ready functions parameter in a programming language of your choice. I suspect OpenAI does something similar during the plugin registration flow, converting openapi specs into functions that the model can call. 

Next steps:
1. Create the frontend, which I'll most likely do using Vercel's AI sdk or their chat template
2. Configure an agent, using [this notebook](https://github.com/openai/openai-cookbook/blob/0d1436b8d9b858c220d708a446a09eef54be61b0/examples/How_to_call_functions_for_knowledge_retrieval.ipynb) in the OpenAI Cookbook

Stay tuned!

## Contributing

I welcome contributions! If you have an idea for a feature, or want to report a bug, please open an issue, or submit a pull request.

Steps to contribute:

1. Fork this repository.
2. Create a feature branch `git checkout -b feature/YourAmazingIdea`.
3. Commit your changes `git commit -m 'Add YourAmazingIdea'`.
4. Push to the branch `git push origin feature/YourAmazingIdea`.
5. Submit a Pull Request.

## License

This project is licensed under the terms of the MIT license.
