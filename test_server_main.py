from fastapi.testclient import TestClient
from server.main import app
from models.api import CodeExecutionRequest, CommandExecutionRequest
import os

# Create a TestClient instance
client = TestClient(app)

BEARER_TOKEN = os.environ.get("BEARER_TOKEN")

headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}

def test_root():
    response = client.get("/", headers=headers)
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_repl():
    repl_request = CodeExecutionRequest(code=["print('hello world')"])
    response = client.post("/repl", json=repl_request.dict(), headers=headers)
    assert response.status_code == 200
    assert response.json() == {"result": "hello world"}

def test_command():
    command_request = CommandExecutionRequest(command="echo Hello")
    response = client.post("/command", json=command_request.dict(), headers=headers)
    assert response.status_code == 200
    assert response.json() == {"result": "Command execution result:\nHello\n"}

def test_get_plugin_manifest():
    response = client.get("/.well-known/ai-plugin.json", headers=headers)
    assert response.status_code == 200

def test_logo_png():
    response = client.get("/.well-known/logo.png", headers=headers)
    assert response.status_code == 200

def test_openapi_yaml():
    response = client.get("/.well-known/openapi.yaml", headers=headers)
    assert response.status_code == 200

def test_invalid_token():
    invalid_headers = {"Authorization": "Bearer INVALID_TOKEN"}
    response = client.get("/", headers=invalid_headers)
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid or missing token"}
