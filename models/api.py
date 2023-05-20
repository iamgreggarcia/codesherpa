from pydantic import BaseModel

class CodeExecutionRequest(BaseModel):
    code: str
    language: str

class CommandExecutionRequest(BaseModel):
    command: str