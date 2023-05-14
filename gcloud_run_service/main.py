from fastapi import FastAPI
import subprocess
from typing import List
import os
from pydantic import BaseModel

class CodeExecutionRequest(BaseModel):
    code: List[str]

app = FastAPI()

@app.post("/execute")
async def execute(code_execution_request: CodeExecutionRequest):
    code_output = execute_code(code_execution_request.code)
    return {"result": code_output}

def execute_code(code_list: List[str]) -> str:
    output = ""
    for code_line in code_list:
        process = subprocess.run(["python", "-c", code_line], text=True, capture_output=True)
        output += process.stdout
    return output

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))