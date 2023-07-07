import os
import pytest
from executors.executor import PythonExecutor

def test_python_executor():
    # Positive Case
    executor = PythonExecutor()
    code = "x = 5\ny = 10\nx*y"
    result = executor.execute(code)
    assert result == "50\n"

    # Negative Caseb
    code = "print('Hello, World!'"
    with pytest.raises(SyntaxError) as excinfo:
        result = executor.execute(code)
    assert "'(' was never closed" in str(excinfo.value)