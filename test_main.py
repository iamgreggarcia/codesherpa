import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import AsyncClient


from main import app, CodeExecutionRequest, CommandExecutionRequest

client = TestClient(app)

def test_repl_endpoint():
    code_request = CodeExecutionRequest(code=["a = 2 + 2", "a"])
    response = client.post("/repl", json=code_request.dict())
    assert response.status_code == 200
    assert response.json() == {"result": "4"}

    code_request = CodeExecutionRequest(code=["1 / 0"])
    response = client.post("/repl", json=code_request.dict())
    assert response.status_code == 200
    assert "ZeroDivisionError: division by zero" in response.json()["result"]

@pytest.mark.asyncio
async def test_command_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        command_request = CommandExecutionRequest(command="echo Hello, World!")
        response = await ac.post("/command", json=command_request.dict())
        assert response.status_code == 200
        expected_result = {"result": "Command execution result:\nHello, World!\n"}
        assert response.json() == expected_result

    async with AsyncClient(app=app, base_url="http://test") as ac:
        command_request = CommandExecutionRequest(command="non_existing_command")
        response = await ac.post("/command", json=command_request.dict())
        assert response.status_code == 200
        assert "Error executing command:" in response.json()["result"]

def test_logo_png():
    response = client.get("/logo.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"

def test_openapi_yaml():
    response = client.get("/openapi.yaml")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/yaml; charset=utf-8"

def test_get_plugin_manifest():
    response = client.get("/.well-known/ai-plugin.json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"