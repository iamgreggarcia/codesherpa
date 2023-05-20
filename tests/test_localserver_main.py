import pytest
from fastapi.testclient import TestClient

from localserver.main import app

client = TestClient(app)

@pytest.mark.parametrize("language, code, expected_output", [
    ("python310", "print('Hello, Python!')", "Hello, Python!"),
    ("c++", '#include<iostream>\nint main() { std::cout << "Hello, C++!" << std::endl; return 0; }', "Hello, C++!"),
    ("rust", "fn main() { println!(\"Hello, Rust!\"); }", "Hello, Rust!")
])

def test_repl_execution(language, code, expected_output):
    response = client.post("/repl", json={"language": language, "code": code})
    assert response.status_code == 200
    assert response.json()["result"].strip() == expected_output

def test_repl_unsupported_language():
    response = client.post("/repl", json={"language": "unsupported", "code": "print('Hello, World!')"})
    assert response.status_code == 200
    assert response.json()["error"] == "Language not supported"

@pytest.mark.parametrize("language, code", [
    ("python310", "print(1/0)"),
    ("c++", "#include<iostream>\nint main() { int x = 0; int y = 10 / x; std::cout << y << std::endl; return 0; }"),
    ("rust", "fn main() { let x = 0; let y = 10 / x; println!(\"{}\", y); }")
])

def test_repl_execution_error(language, code):
    response = client.post("/repl", json={"language": language, "code": code})
    assert response.status_code == 200
    assert "error" in response.json()
