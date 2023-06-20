import os
import pytest
import subprocess
from executors.executor import PythonExecutor, CppExecutor, RustExecutor

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

def test_cpp_executor():
    # Positive Case
    executor = CppExecutor()
    code = """
    #include <iostream>
    int main() {
        std::cout << "Hello, World!" << std::endl;
        return 0;
    }
    """
    result = executor.execute(code)
    assert result == "Hello, World!\n"

    # Negative Case
    code = """
    #include <iostream>
    int main() {
        std::cout << "Hello, World!" << std::endl
        return 0;
    }
    """
    with pytest.raises(subprocess.CalledProcessError):
        result = executor.execute(code)

def test_rust_executor():
    # Positive Case
    executor = RustExecutor()
    code = """
    fn main() {
        println!("Hello, World!");
    }
    """
    result = executor.execute(code)
    assert result == "Hello, World!\n"

    # Negative Case
    code = """
    fn main() {
        println!("Hello, World!);
    }
    """
    with pytest.raises(subprocess.CalledProcessError):
        result = executor.execute(code)

def test_tear_down():
    print("Tearing down...")
    file_names = ["script.cpp", "script.rs", "script", "a.out"]
    for file_name in file_names:
        file_path = os.path.join(os.getcwd(), file_name)
        os.remove(file_path)