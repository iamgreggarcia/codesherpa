import pytest
from fastapi.testclient import TestClient
from server.main import app
from models.api import CodeExecutionRequest, CommandExecutionRequest
from unittest.mock import MagicMock, patch
import os

# Create a TestClient instance
client = TestClient(app)

BEARER_TOKEN = os.environ.get("BEARER_TOKEN")

headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}

def test_repl():
    with patch("server.main.container_manager") as mock_container_manager:
        mock_container = MagicMock()
        # Mock exec_run to return a generator of bytes-like objects
        mock_container.exec_run.return_value = (0, (line for line in [b"hello world\n"]))
        mock_container_manager.user_containers.get.return_value = mock_container

        repl_request = CodeExecutionRequest(code=["print('hello world')"])
        response = client.post("/repl", json=repl_request.dict(), headers=headers)
        assert response.status_code == 200
        assert response.json() == {"result": "hello world"}

def test_command():
    with patch("server.main.container_manager") as mock_container_manager:
        mock_container = MagicMock()
        # Mock exec_run to return a generator of bytes-like objects
        mock_container.exec_run.return_value = (0, (line for line in [b"Hello\n"]))
        mock_container_manager.user_containers.get.return_value = mock_container

        command_request = CommandExecutionRequest(command="echo Hello")
        response = client.post("/command", json=command_request.dict(), headers=headers)
        assert response.status_code == 200
        assert response.json() == {"result": "Command execution result:\nHello\n"}


# def test_command():
#     command_request = CommandExecutionRequest(command="echo Hello")
#     response = client.post("/command", json=command_request.dict(), headers=headers)
#     assert response.status_code == 200
#     assert response.json() == {"result": "Command execution result:\nHello\n"}

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
