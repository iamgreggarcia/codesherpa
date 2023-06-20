from pydantic import BaseModel, Field

class CodeExecutionRequest(BaseModel):
    """
    A Pydantic model representing a request to execute code.

    Attributes:
        language (str): The programming language of the code to be executed.
        code (str): The code to be executed.
    """
    language: str = Field(..., example="python")
    code: str = Field(..., example="print('Hello, World!')")

    class Config:
        schema_extra = {
            "example": {
                "language": "python",
                "code": "print('Hello, World!')"
            }
        }

class CommandExecutionRequest(BaseModel):
    """
    A Pydantic model representing a request to execute a command.

    Attributes:
        command (str): The command to be executed.
    """
    command: str = Field(..., example="ls -la")

    class Config:
        schema_extra = {
            "example": {
                "command": "ls -la"
            }
        }
