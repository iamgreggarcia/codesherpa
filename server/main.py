import sys
import os
import code
import subprocess

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
import uvicorn

from models.api import CodeExecutionRequest, CommandExecutionRequest
from executors.executor import PythonExecutor, CppExecutor, RustExecutor 
from config import API_VERSION

logger.configure(handlers=[{"sink": sys.stderr, "format": "<green>{time}</green> <level>{message}</level>", "colorize": True}])

app = FastAPI()

executors = {
    "python": PythonExecutor(),
    "c++": CppExecutor(),
    "rust": RustExecutor(),
}

PORT = 8080

origins = [
    f"http://0.0.0.0:{PORT}",
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

_SERVICE_AUTH_KEY = os.environ.get("SERVICE_AUTH_KEY")

def assert_auth_header(req: Request):
    """Asserts the presence of the correct authorization header in the request."""
    assert req.headers.get(
        "Authorization", None) == f"Bearer {_SERVICE_AUTH_KEY}"

@app.get("/.well-known/ai-plugin.json")
async def get_manifest():
    """Returns the manifest file."""
    file_path = "./server/ai-plugin.json"
    return FileResponse(file_path, media_type="application/json")

@app.get("/.well-known/logo.png")
async def get_logo():
    """Returns the logo file."""
    file_path = "./server/logo.png"
    return FileResponse(file_path, media_type="text/json")

@app.get("/.well-known/openapi.yaml")
async def get_openapi():
    """Returns the OpenAPI specification file."""
    file_path = "./server/openapi.yaml"
    return FileResponse(file_path, media_type="text/json")

persistent_console = code.InteractiveConsole()

@app.post(f"{API_VERSION}/repl")
def repl(request: CodeExecutionRequest):
    """Executes code in a REPL environment and returns the result."""
    assert_auth_header(request)
    logger.info(f"Received request for REPL execution: {request}")
    
    executor = executors.get(request.language)
    if executor is None:
        return {"error": "Language not supported"}
    
    try:
        code_output = executor.execute(request.code)
        logger.info(f"REPL execution result: {code_output}")
        response = {"result": code_output.strip()}
    except subprocess.CalledProcessError as e:
        logger.error(f"Error in REPL execution: {e}. Return code: {e.returncode}. Output: {e.output}")
        response = {
            "error": str(e),
            "returnCode": e.returncode,
            "command": ' '.join(e.cmd),
            "output": e.output
        }
        return response
    except Exception as e:
        logger.error(f"Error in REPL execution: {e}")
        response = {"error": str(e)}
        return response
    
    return response

@app.post(f"{API_VERSION}/command")
async def command_endpoint(command_request: CommandExecutionRequest):
    """Executes a shell command and returns the result."""
    assert_auth_header(command_request)
    logger.info(f"Executing command with request: {command_request}")
    try:
        command_result = await execute_command(command_request.command)
        logger.info(f"Command execution result: {command_result}")
        return {"result": command_result}
    except Exception as e:
        logger.error(f"Error in command execution: {e}")
        return {"error": str(e)}
    
async def execute_command(command: str) -> str:
    """Executes the given command in a shell and returns the result."""
    try:
        result = subprocess.run(
            command.split(), capture_output=True, text=True)
        return f"Result:\n{result.stdout}"
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing command: {e}. Return code: {e.returncode}. Output: {e.output}")
        return {
            "error": str(e),
            "returnCode": e.returncode,
            "command": ' '.join(e.cmd),
            "output": e.output
        }
    except Exception as e:
        logger.error(f"Error executing command: {e}")
        return f"Error executing command: {str(e)}"

def start():
    """Starts the FastAPI server."""
    uvicorn.run("server.main:app", host="0.0.0.0", port=PORT, reload=False)