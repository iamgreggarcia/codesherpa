from pydantic import BaseModel, Field

class CodeExecutionRequest(BaseModel):
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
    command: str = Field(..., example="ls -la")

    class Config:
        schema_extra = {
            "example": {
                "command": "ls -la"
            }
        }
