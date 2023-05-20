import abc
import subprocess

class Executor(abc.ABC):
    @abc.abstractmethod
    def execute(self, code: str) -> str:
        pass

class PythonExecutor(Executor):
    def execute(self, code: str) -> str:
        with open("script.py", "w") as f:
            f.write(code)
        output = subprocess.run(["python3", "script.py"], capture_output=True, text=True, check=True)
        return output.stdout

class CppExecutor(Executor):
    def execute(self, code: str) -> str:
        with open("script.cpp", "w") as f:
            f.write(code)
        subprocess.run(["g++", "script.cpp"], check=True)
        output = subprocess.run(["./a.out"], capture_output=True, text=True, check=True)
        return output.stdout

class RustExecutor(Executor):
    def execute(self, code: str) -> str:
        with open("script.rs", "w") as f:
            f.write(code)
        subprocess.run(["rustc", "script.rs"], check=True)
        output = subprocess.run(["./script"], capture_output=True, text=True, check=True)
        return output.stdout
