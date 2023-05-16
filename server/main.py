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
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from google.oauth2 import service_account
import google.auth.transport.requests
import httpx

logger.remove()
logger.add(sys.stderr, level="INFO")

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/.well-known", StaticFiles(directory=".well-known"), name="well-known")

persistent_console = code.InteractiveConsole()

@app.post("/repl")
@limiter.limit("5/minute")
async def repl(request: Request, code_execution_request: CodeExecutionRequest):
    response = await send_request_to_gcloud_run(code_execution_request)
    return response

async def send_request_to_gcloud_run(code_execution_request: CodeExecutionRequest):
    url = os.environ.get('GOOGLE_CLOUD_RUN_URL')

    # Load the service account key file
    service_account_info = json.load(open('google-credentials.json'))

    # Use the key to create credentials
    credentials = service_account.Credentials.from_service_account_info(service_account_info)

    # Create an access token
    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    token = credentials.token

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    data = {"code": code_execution_request.code}
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
    return response.json()

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


if __name__ == "__main__":
    start()