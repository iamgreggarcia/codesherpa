import os
import io
import json
import code
import sys
import subprocess
from typing import List, Annotated
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from fastapi.staticfiles import StaticFiles
from contextlib import redirect_stderr, redirect_stdout
import uvicorn
from models.api import CodeExecutionRequest, CommandExecutionRequest
from loguru import logger
from .container_manager import ContainerManager

logger.remove()
logger.add(sys.stderr, level="INFO")



bearer_scheme = HTTPBearer()
BEARER_TOKEN = os.environ.get("BEARER_TOKEN")
assert BEARER_TOKEN is not None

container_manager = ContainerManager()

def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    print(f"Validating token: {credentials}")
    if credentials.scheme != "Bearer" or credentials.credentials != BEARER_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing token")
        
    container_manager.create_container_for_user(credentials.credentials)

    return credentials


app = FastAPI(dependencies=[Depends(validate_token)])

app.mount("/static", StaticFiles(directory="static"), name="static")
# mount the .well-known directory to serve the manifest and logo
app.mount("/.well-known", StaticFiles(directory=".well-known"), name="well-known")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

persistent_console = code.InteractiveConsole()

def execute_code_in_repl(code_list: List[str]) -> str:
    output = io.StringIO()

    try:
        with redirect_stdout(output), redirect_stderr(output):
            for code_line in code_list:
                persistent_console.push(code_line)
        result = output.getvalue()

    except Exception as e:
        result = str(e)

    return result

@app.post("/repl")
def repl(request: CodeExecutionRequest):
    try:
        code_output = execute_code_in_repl(request.code)
        response = {"result": code_output.strip()}
    except Exception as e:
        response = {"error": str(e)}
        return response
    
    return response

async def execute_command(command: str) -> str:
    try:
        result = subprocess.run(
            command.split(), capture_output=True, text=True)
        return f"Command execution result:\n{result.stdout}"
    except Exception as e:
        return f"Error executing command: {str(e)}"


@app.post("/command")
async def command_endpoint(command_request: CommandExecutionRequest):
    try:
        command_result = await execute_command(command_request.command)
        return {"result": command_result}
    except Exception as e:
        return {"error": str(e)}

@app.get("/openapi.yaml")
async def openapi_yaml():
    try:
        return FileResponse("openapi.yaml", media_type="text/yaml")
    except FileNotFoundError:
        raise HTTPException(
            status_code=404, detail="OpenAPI specification file not found.")

@app.get("/.well-known/ai-plugin.json")
async def get_plugin_manifest():
    try:
        with open(".well-known/ai-plugin.json", "r") as f:
            manifest = json.load(f)
        return manifest
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Manifest file not found.")
    
@app.get("/logo.png")
async def logo_png():
    try:
        return FileResponse("logo.png", media_type="image/png")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Logo file not found.")

@app.get("/")
async def root():
    return {"message": "Hello World"}

def start():
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server.main:app", host="0.0.0.0", port=port, reload=True)

