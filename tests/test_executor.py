import os
import pytest
from executors.executor import PythonExecutor

def test_python_executor():
    # Positive Case
    executor = PythonExecutor()
    code = "x = 5\ny = 10\nx*y"
    result = executor.execute(code)
    assert result == "50\n"

    # Negative Case
    code = "print('Hello, World!'"
    with pytest.raises(SyntaxError) as excinfo:
        result = executor.execute(code)
    assert "'(' was never closed" in str(excinfo.value)

# def test_tear_down():
#     print("Tearing down...")
#     file_names = ["script.cpp", "script.rs", "script", "a.out"]
#     for file_name in file_names:
#         file_path = os.path.join(os.getcwd(), file_name)
#         os.remove(file_path)