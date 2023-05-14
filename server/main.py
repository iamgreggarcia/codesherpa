import os
import io
import json
import code
import sys
import subprocess
from typing import List, Annotated
from fastapi import FastAPI, HTTPException, Depends, WebSocket, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from contextlib import redirect_stderr, redirect_stdout
import uvicorn
from models.api import CodeExecutionRequest, CommandExecutionRequest
from loguru import logger
from .container_manager import ContainerManager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

logger.remove()
logger.add(sys.stderr, level="INFO")

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

container_manager = ContainerManager()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/.well-known", StaticFiles(directory=".well-known"), name="well-known")

persistent_console = code.InteractiveConsole()

@app.post("/repl")
@limiter.limit("5/minute")
async def repl(request: Request, code_execution_request: CodeExecutionRequest):
    code_output = execute_code_in_repl(code_execution_request.code)
    return {"result": code_output}

def execute_code_in_repl(code_list: List[str]) -> str:
    output = io.StringIO()

    try:
        with redirect_stdout(output), redirect_stderr(output):
            for code_line in code_list:
                for command in code_line.split(';'):
                    result = persistent_console.push(command.strip())
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

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def start():
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("server.main:app", host="0.0.0.0", port=port, reload=True)

