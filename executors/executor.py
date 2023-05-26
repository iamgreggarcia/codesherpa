import abc
import sys
import subprocess
from loguru import logger

logger.configure(
    handlers=[
        {
            "sink": sys.stderr,
            "format": "<green>{time}</green> <level>{message}</level>",
            "colorize": True,
        }
    ]
)

class Executor(abc.ABC):
    @abc.abstractmethod
    def execute(self, code: str) -> str:
        pass

class PythonExecutor(Executor):
    def execute(self, code: str) -> str:
        logger.info("Executing Python code: {}", code)
        with open("script.py", "w") as f:
            f.write(code)
        try:
            output = subprocess.run(["python3.10", "script.py"], capture_output=True, text=True, check=True)
            return output.stdout
        except subprocess.CalledProcessError as e:
            # log the error
            logger.error("Error executing Python code: {}", e)
            raise subprocess.CalledProcessError(e.returncode, e.cmd, output=e.stderr)

class CppExecutor(Executor):
    def execute(self, code: str) -> str:
        with open("script.cpp", "w") as f:
            f.write(code)
        try:
            subprocess.run(["g++", "script.cpp"], check=True)
            output = subprocess.run(["./a.out"], capture_output=True, text=True, check=True)
            return output.stdout
        except subprocess.CalledProcessError as e:
            # Here we include e.stderr in the output.
            raise subprocess.CalledProcessError(e.returncode, e.cmd, output=e.stderr)

class RustExecutor(Executor):
    def execute(self, code: str) -> str:
        with open("script.rs", "w") as f:
            f.write(code)
        try:
            subprocess.run(["rustc", "script.rs"], check=True)
            output = subprocess.run(["./script"], capture_output=True, text=True, check=True)
            return output.stdout
        except subprocess.CalledProcessError as e:
            # Here we include e.stderr in the output.
            raise subprocess.CalledProcessError(e.returncode, e.cmd, output=e.stderr)
