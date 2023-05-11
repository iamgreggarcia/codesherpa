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



@app.post("/repl")
def repl(request: CodeExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
    user_container = container_manager.user_containers.get(credentials.credentials)
    if not user_container:
        raise HTTPException(status_code=410, detail="Docker container not found")
    
    code_output = execute_code_in_repl(request.code, user_container)
    response = {"result": code_output.strip()}
    return response

@app.post("/command")
async def command_endpoint(command_request: CommandExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
    user_container = container_manager.user_containers.get(credentials.credentials)
    if not user_container:
        raise HTTPException(status_code=410, detail="Docker container not found")
    
    command_result = await execute_command(command_request.command, user_container)
    return {"result": command_result}

def execute_code_in_repl(code_list: List[str], container) -> str:
    output = io.StringIO()

    try:
        with redirect_stdout(output), redirect_stderr(output):
            for code_line in code_list:
                result = container.exec_run(f"python -c '{code_line}'", stream=True)
                for line in result[1]:
                    output.write(line.decode("utf-8"))
        result = output.getvalue()

    except Exception as e:
        result = str(e)

    return result

async def execute_command(command: str, container) -> str:
    try:
        result = container.exec_run(command, stream=True)
        output = ""
        for line in result[1]:
            if isinstance(line, bytes):
                output += line.decode("utf-8")
            else:
                output += str(line)
        return f"Command execution result:\n{output}"
    except Exception as e:
        return f"Error executing command: {str(e)}"

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

