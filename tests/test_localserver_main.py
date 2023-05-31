import os
import tempfile
import pytest
from fastapi.testclient import TestClient

from localserver.main import app

client = TestClient(app)

@pytest.mark.parametrize("language, code, expected_output", [
    ("python", "print('Hello, Python!')", "Hello, Python!"),
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

@pytest.mark.parametrize("language, code, error_message", [
    ("python", "print(1/0)", "division by zero")
    # ("c++", "#include<iostream>\nint main() { int x = 0; int y = 10 / x; std::cout << y << std::endl; return 0; }", "division by zero"),
    # ("rust", "fn main() { let x = 0; let y = 10 / x; println!(\"{}\", y); }", "attempt to divide by zero")
])

def test_repl_execution_error(language, code, error_message):
    response = client.post("/repl", json={"language": language, "code": code})
    assert response.status_code == 200
    assert "result" in response.json()
    assert error_message in response.json()["result"]
    
def test_upload_file():
    with tempfile.NamedTemporaryFile(delete=False) as temp_file:
        temp_file.write(b"test file contents")
        temp_file.seek(0)
        response = client.post("/upload", files={"file": temp_file})
        assert response.status_code == 200
        assert response.json().get("message") == "File uploaded successfully"
        assert response.json().get("url") is not None
        os.remove(temp_file.name)