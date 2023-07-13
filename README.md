# codesherpa

**codesherpa** is a code interpreter **ChatGPT plugin** and a **standalone** code interpreter (_**experimental**_). Read the [Quickstart section](#quickstart) to try it out.

### You can use it as a

- code interpreter plugin with ChatGPT
  - API for ChatGPT to run and execute code with file persistance and no timeout 
- standalone code interpreter (_**experimental**_). 
  - Using OpenAI's [GPT function calling](https://platform.openai.com/docs/guides/gpt/function-calling), I've tried to recreate the experience of the ChatGPT Code Interpreter by using `functions`. For many reasons, there is a significant difference between this implementation and the ChatGPT Code Interpreter created by OpenAI. It's still very buggy and inconsistent, but I wanted to put it out there in the world anyone interested.


Standalone code interpreter demo:



https://github.com/iamgreggarcia/codesherpa/assets/16596972/96cb0694-fec6-4046-99d6-2e141b2a853f





ChatGPT Plugin demo:

https://github.com/iamgreggarcia/codesherpa/assets/16596972/b7afb034-6b74-42a3-9496-a912bcaf0f66


See more [examples here](#examples)


## Recent Updates

- **July 13, 2023**: 
  - A basic standalone UI is now available. Read the [Quickstart section](#quickstart) to try it (requires an OpenAI API key). _NOTE_: expect **many** bugs and shortcomings, especially if you've been binging OpenAI's Code Interpreter since its been made generally available to Plus subscribers
  - New contributions from [emsi](https://github.com/emsi) [(#18)]([Title](https://github.com/iamgreggarcia/codesherpa/pull/18)) and [PeterDaveHello](https://github.com/PeterDaveHello) [(#28)](https://github.com/iamgreggarcia/codesherpa/pull/28)! 👏
- **June 21, 2023**: 
    - The ChatGPT plugin service will now fetch the `openapi.json` generated be the server. Also added [request example data](https://fastapi.tiangolo.com/tutorial/schema-extra-example/) which is included in the api spec. This reduces the size of the plugin manifest `description_for_model`.
    - Updated the README section on future work. 
<details>
<summary>Previous Updates</summary>

- **June 18, 2023**: Added `docker-compose.yml`
- **May 31, 2023**: Introduced new file upload interface via `upload.html` and corresponding server endpoint, allowing you to upload files at `localhost:3333/upload` or by telling ChatGPT you want to upload a file or have a file you want to work with: ![upload-demo](https://github.com/iamgreggarcia/codesherpa/assets/16596972/bb1bcadf-7152-44fb-becb-f571094cbf56) Refactored Python code execution using `ast` module for enhanced efficiency. Local server and manifest file updates to support these features. Minor updates to REPL execution, error handling, and code formatting.
- **May 22, 2023**: Refactored README to provide clear and concise instructions for building and running codesherpa.
- **May 20, 2023**: codesherpa now supports multiple programming languages, including Python, C++, and Rust.

</details>

## Quickstart

### NEW: Standalone code interpreter (experimental)

To try the new chat interface:

```bash
# Clone the repository
git clone https://github.com/iamgreggarcia/codesherpa.git
```
Add your `OPENAI_API_KEY` to a copy of `.env.example`:
```bash
cd codesherpa/frontend
cp .env.example .env.local
```

Install dependencies and startup the Next.js app:
```bash
pnpm install
pnpm dev
```
OR

```bash
npm install
npm run dev
```
Download the docker image OR run the codesherpa API locally (beware!):

Docker image:
```bash
# Pull the Docker image
docker pull ghcr.io/iamgreggarcia/codesherpa:latest

# Run the Docker image locally
docker compose up
```

Run the server locally (potentially risky!):
```bash
cd codesherpa
make dev
```

Navigate to `http://localhost:3000`. Expect bugs and inconsistencies.

### Installation and Running codesherpa as a ChatGPT Plugin

### Prerequisites

Ensure the following software is installed on your system:

- Python 3.10
- Docker
- Docker Compose (optional). Download Docker Desktop or the plugin to use Docker Compose
    - Pluin:
      - [Linux](https://docs.docker.com/compose/install/#scenario-two-install-the-compose-plugin)
    - Desktop:
      - [Linux](https://docs.docker.com/desktop/install/linux-install/)
      - [Mac](https://docs.docker.com/desktop/install/mac-install/)
      - [Windows](https://docs.docker.com/desktop/install/windows-install/)


**Option 1: Using Docker image from Github Packages**

```bash
# Pull the Docker image
docker pull ghcr.io/iamgreggarcia/codesherpa:latest

# Run the Docker image locally
docker compose up
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

Instead of Make commands, you can use the following Docker commands directly or use Docker Compose

```bash
# Clone the repository
git clone https://github.com/iamgreggarcia/codesherpa.git

# Navigate to the repository directory
cd codesherpa

# Build the Docker image
docker build -t codesherpa .

# Run the Docker image locally
docker run -p 3333:3333 codesherpa python3 -c "import localserver.main; localserver.main.start()"

# OR use Docker Compose

docker compose up
```

Whichever option you choose, codesherpa will be accessible at [localhost:3333](http://localhost:3333).

### Connecting codesherpa to ChatGPT

1. Navigate to the ChatGPT UI, and access the plugin store.
2. Select "Develop your own plugin".
3. In the plugin URL input, enter `localhost:3333`. Your ChatGPT should now be able to use codesherpa's features.


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
- Improve the UI (maybe). The UI needs a lot of love:
  - multi-conversation support
  - previous message editing
  - granular control over parameters
  - consistent function call rendering

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
