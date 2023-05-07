import subprocess
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import io
import json
import code
from contextlib import redirect_stderr, redirect_stdout

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeExecutionRequest(BaseModel):
    code: List[str]

class CommandExecutionRequest(BaseModel):
    command: str

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

