"""
A local server script to handle REPL and command execution requests.
"""


import sys
import subprocess
import shutil
import signal
import json
import textwrap
from typing import List

from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
import uvicorn

from models.api import CodeExecutionRequest, CommandExecutionRequest
from executors.executor import PythonExecutor, CppExecutor, RustExecutor

logger.configure(
    handlers=[
        {
            "sink": sys.stderr,
            "format": "<green>{time}</green> <level>{message}</level>",
            "colorize": True,
        }
    ]
)

app = FastAPI()

executors = {
    "python": PythonExecutor(),
    "c++": CppExecutor(),
    "rust": RustExecutor(),
}

PORT = 3333

origins = [
    f"http://localhost:{PORT}",
    "http://localhost:3001",
    "https://chat.openai.com",
]

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: clean this up
description_for_model = textwrap.dedent(f"""
    codeherpa is a Dockerized FastAPI application that provides a persistent REPL (Read-Eval-Print Loop) session, 
    command execution, and the ability to interact with the container filesystem in Python. C++ and Rust are available for code execution,
    but are stateless and do not persist between requests. codesherpa runs on ubuntu:22.04. It has many 
    
    ## `/repl` endpoint
    Through the `/repl` endpoint, you can execute Python code interactively. For example, whenever requested by a user for 
    assistance with tasks, data analysis and visualizations, creating images, learning programming, etc., you might use the `/repl` endpoint. 
    By default, the following Python packages are installed in the Docker container: matplotlib,seaborn,pandas,numpy,scipy,openpyxl,scikit-learn

    To execute code, send a POST request to the `/repl` endpoint containing an escaped JSON object with a 'code' key for the code and a 'language' key for the language 
    in which the code should be executed. For example, to execute the Python code `print('hello world')`, send a POST request to the `/repl` endpoint
    with the following escaped JSON object: `{{\\\"code\\\": \\\"print('hello world')\\\", \\\"language\\\": \\\"python\\\"}}`. Always present the user with the code block formatted code used in the request.
    
    When a user asks to upload a file, or mention they have a file they want you to analyze, or that they have a question 
    regarding a spreadsheet, a dataset, etc., present an 'Upload file' link to the user. This link 
    should point to the url: http://localhost:{PORT}/upload. When a user asks for data analysis, proactively examine the 
    uploaded file for its contents. Specifically, you should 
        1. Understand the file type (e.g., CSV, Excel, JSON, etc.) and determine the best way to read it.
        2. Immediately analyze the shape of the data (e.g., 'I see you've uploaded a CSV file with 100 rows and 5 columns.), write a concise summary of the data (e.g., 'Here is a summary of the data: ...'), and present visualizations of the data (e.g., 'Here are some visualizations of the data: ...').
            a. Create informative and beautiful visualizations. You have several Python packages at your disposal, including matplotlib and seaborn.
        3. Present key insights from the data (e.g., 'Here are some key insights from the data: ...').
        4. Ask the user if they have any questions about the data or if they would like you to perform any additional analysis.

    ## `/command` endpoint
    To run a terminal command and interact with the Docker container filesystem, send an escaped JSON object with a 'command' key containing the terminal command to the `/command` endpoint. The `/command` endpoint is useful if you need to install a python package, download a file, or perform other tasks that require a terminal command. An example request for executing a command (in escaped JSON format) looks like this:

    `{{\\\"command\\\": \\\"pip install pandas\\\"}}`.

    When presenting a media file created via a command, code execution, created by you, or uploaded by the user, use the corresponding 
    `http://localhost:{PORT}/static/images/` URL to embed it in the response. That is, you should show images in your responses. 
    For example, for an image named 'example.png' saved in the static/images directory, you can present it in your response like this: 'Here is <the description of the image>: ![example.png](http://localhost:{PORT}/static/images/example.png)'. Another example would be to show a graph of the data you analyzed and saved in the `/static/uploads` folder.
    
    User uploaded files (e.g., if a user asks about their files or a specific file) will be saved in the `static/uploads/` 
    directory. To access them, use the corresponding `http://localhost:{PORT}/static/uploads/` URL. For instance, for an image 
    named 'example.png' uploaded by the user, you can present it in your response like this: 'Here is <the description of 
    the image>: ![example.png](http://localhost:{PORT}/static/uploads/example.png)'.
""")

def load_and_modify_manifest():
    """
    Loads the AI plugin manifest JSON file and modifies the description_for_model field.
    """
    with open("./localserver/ai-plugin.json", "r") as f:
        manifest = json.load(f)
    manifest["description_for_model"] = description_for_model
    return manifest

@app.get("/upload")
async def upload_page(request: Request):
    return HTMLResponse(content=open("templates/upload.html", "r").read(), status_code=200)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a file.

    Args:
        file (UploadFile): The uploaded file.

    Returns:
        dict: The result of the file upload process.
    """
    try:
        file_location = f"static/uploads/{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"File uploaded: {file.filename}")

        # Construct the URL of the uploaded file
        url = f"http://localhost:{PORT}/{file_location}"

        return {"message": "File uploaded successfully", "url": url}
    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return {"error": str(e)}


@app.get("/.well-known/ai-plugin.json")
async def get_manifest():
    """
    Endpoint to serve the manifest file.
    """
    manifest = load_and_modify_manifest()
    return manifest

@app.get("/.well-known/logo.png")
async def get_logo():
    """
    Endpoint to serve the logo file.
    """
    file_path = "./localserver/logo.png"
    return FileResponse(file_path, media_type="text/json")


@app.get("/.well-known/openapi.yaml")
async def get_openapi():
    """
    Endpoint to serve the openapi specification file.
    """
    file_path = "./localserver/openapi.yaml"
    return FileResponse(file_path, media_type="text/json")


@app.post("/repl")
def repl(request: CodeExecutionRequest):
    """
    Endpoint to execute code in a REPL environment.
    Note: This endpoint current supports a REPL-like environment for Python only.
    
    Args:
        request (CodeExecutionRequest): The request object containing the code to execute.

    Returns:
        dict: The result of the code execution.
    """
    logger.info(f"Received request for REPL execution: {request}")

    executor = executors.get(request.language)
    if executor is None:
        return {"error": "Language not supported"}

    try:
        code_output = executor.execute(request.code)
        logger.info(f"REPL execution result: {code_output}")
        response = {"result": code_output.strip()}
    except Exception as e:
        logger.error(f"Error in REPL execution: {e}")
        response = {"error": str(e)}
        return response

    return response



async def execute_command(command: str) -> str:
    """
    Executes the given command in a shell and returns the result.

    Args:
        command (str): The command to execute.

    Returns:
        str: The result of the command execution.
    """
    try:
        result = subprocess.run(command.split(), capture_output=True, text=True)
        return f"Result:\n{result.stdout}"
    except subprocess.CalledProcessError as e:
        logger.error(
            f"Error executing command: {e}. Return code: {e.returncode}. Output: {e.output}"
        )
        return f"Error executing command: {str(e)}"
    except Exception as e:
        logger.error(f"Error executing command: {e}")
        return f"Error executing command: {str(e)}"


@app.post("/command")
async def command_endpoint(command_request: CommandExecutionRequest):
    """
    Endpoint to execute a shell command.

    Args:
        command_request (CommandExecutionRequest): The request object containing the command to execute.

    Returns:
        dict: The result of the command execution.
    """
    logger.info(f"Executing command with request: {command_request}")
    try:
        command_result = await execute_command(command_request.command)
        logger.info(f"Command execution result: {command_result}")
        return {"result": command_result}
    except Exception as e:
        logger.error(f"Error in command execution: {e}")
        return {"error": str(e)}


def start():
    """
    Starts the FastAPI server.
    """

    def shutdown():
        logger.info("Shutting down server...")
        sys.exit(0)

    signal.signal(signal.SIGINT, lambda signum, frame: shutdown())

    uvicorn.run("localserver.main:app", host="0.0.0.0", port=PORT, reload=False)
