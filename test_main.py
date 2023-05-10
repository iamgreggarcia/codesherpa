import json
from localserver.main import app, execute_code_in_repl
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_manifest():
    async with AsyncClient(app=app, base_url="http://localhost:3333") as ac:
        response = await ac.get("/.well-known/ai-plugin.json")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"

@pytest.mark.asyncio
async def test_get_logo():
    async with AsyncClient(app=app, base_url="http://localhost:3333") as ac:
        response = await ac.get("/.well-known/logo.png")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_openapi():
    async with AsyncClient(app=app, base_url="http://localhost:3333") as ac:
        response = await ac.get("/.well-known/openapi.yaml")
    assert response.status_code == 200

def test_execute_code_in_repl():
    test_code = [
        "a = 1",
        "b = 2",
        "c = a + b",
        "c"
    ]
    result = execute_code_in_repl(test_code)
    assert result.strip() == "3"

@pytest.mark.asyncio
async def test_repl():
    async with AsyncClient(app=app, base_url="http://localhost:3333") as ac:
        code = [
            "a = 1",
            "b = 2",
            "c = a + b",
            "c"
        ]
        response = await ac.post("/repl", json={"code": code})
    assert response.status_code == 200
    assert json.loads(response.text)["result"] == "3"

@pytest.mark.asyncio
async def test_command_endpoint():
    async with AsyncClient(app=app, base_url="http://localhost:3333") as ac:
        response = await ac.post("/command", json={"command": "echo 'Hello, world!'"})
    assert response.status_code == 200
    response_text = json.loads(response.text)["result"].strip()
    assert "Hello, world!" in response_text