"""
A local server script to handle REPL and command execution requests.
"""

import io
import sys
import code
import subprocess
from contextlib import redirect_stderr, redirect_stdout

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
import uvicorn

from models.api import CodeExecutionRequest, CommandExecutionRequest
from executors.executor import PythonExecutor, CppExecutor, RustExecutor


logger.configure(handlers=[{"sink": sys.stderr, "format": "<green>{time}</green> <level>{message}</level>", "colorize": True}])

app = FastAPI()

executors = {
    "python310": PythonExecutor(),
    "c++": CppExecutor(),
    "rust": RustExecutor(),
}

PORT = 3333

origins = [
    f"http://localhost:{PORT}",
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

@app.get("/.well-known/ai-plugin.json")
async def get_manifest():
    """
    Endpoint to serve the manifest file.
    """
    file_path = "./localserver/ai-plugin.json"
    return FileResponse(file_path, media_type="application/json")


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

persistent_console = code.InteractiveConsole()

@app.post("/repl")
def repl(request: CodeExecutionRequest):
    """
    Endpoint to execute code in a REPL environment.
    
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
        result = subprocess.run(
            command.split(), capture_output=True, text=True)
        return f"Result:\n{result.stdout}"
    except Exception as e:
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
    uvicorn.run("localserver.main:app", host="0.0.0.0", port=PORT, reload=True)
