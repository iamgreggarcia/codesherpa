import subprocess
from typing import List
from fastapi import FastAPI, HTTPException,UploadFile, File 
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil
from pydantic import BaseModel
import io
import json
import sys
import code
from contextlib import redirect_stderr, redirect_stdout
from models.api import CodeExecutionRequest, CommandExecutionRequest
import uvicorn
from loguru import logger

logger.remove()
logger.configure(handlers=[{"sink": sys.stderr, "format": "<green>{time}</green> <level>{message}</level>", "colorize": True}])

app = FastAPI()

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
    file_path = "./localserver/ai-plugin.json"
    return FileResponse(file_path, media_type="application/json")


@app.get("/.well-known/logo.png")
async def get_logo():
    file_path = "./localserver/logo.png"
    return FileResponse(file_path, media_type="text/json")


@app.get("/.well-known/openapi.yaml")
async def get_openapi():
    file_path = "./localserver/openapi.yaml"
    return FileResponse(file_path, media_type="text/json")

persistent_console = code.InteractiveConsole()

def execute_code_in_repl(code: str) -> str:
    logger.info(f"Executing code in REPL - this is an update: {code}")
    output = io.StringIO()

    # Split the code into lines
    code_lines = code.split('\n')

    try:
        with redirect_stdout(output), redirect_stderr(output):
            # Execute each line of code in the REPL
            for line in code_lines:
                persistent_console.push(line)
        result = output.getvalue()

    except Exception as e:
        result = str(e)

    return result


@app.post("/repl")
def repl(request: CodeExecutionRequest):
    logger.info(f"Executing REPL with request: {request}")
    try:
        code_output = execute_code_in_repl(request.code)
        logger.info(f"REPL execution result: {code_output}")
        response = {"result": code_output.strip()}
    except Exception as e:
        logger.error(f"Error in REPL execution: {e}")
        response = {"error": str(e)}
        return response
    
    return response

async def execute_command(command: str) -> str:
    try:
        result = subprocess.run(
            command.split(), capture_output=True, text=True)
        return f"Result:\n{result.stdout}"
    except Exception as e:
        return f"Error executing command: {str(e)}"


@app.post("/command")
async def command_endpoint(command_request: CommandExecutionRequest):
    logger.info(f"Executing command with request: {command_request}")
    try:
        command_result = await execute_command(command_request.command)
        logger.info(f"Command execution result: {command_result}")
        return {"result": command_result}
    except Exception as e:
        logger.error(f"Error in command execution: {e}")
        return {"error": str(e)}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    with open(Path("static/images") / file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}

    
def start():
    uvicorn.run("localserver.main:app", host="0.0.0.0", port=PORT, reload=True)