
1. **User Authentication**

   Update the `validate_token` function in `server/main.py` to create a new session and Docker container for the user if one doesn't already exist:

   ```python
   from container_manager import ContainerManager

   container_manager = ContainerManager()

   def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
       print(f"Validating token: {credentials}")
       if credentials.scheme != "Bearer" or credentials.credentials != BEARER_TOKEN:
           raise HTTPException(status_code=401, detail="Invalid or missing token")

       # Create a new session and Docker container if one doesn't already exist
       container_manager.create_container_for_user(credentials.credentials)

       return credentials
   ```

2. **Session Creation**

   Create a new file `container_manager.py` to manage the lifecycle of Docker containers:

   ```python
   import docker

   class ContainerManager:
       def __init__(self):
           self.docker_client = docker.from_env()
           self.user_containers = {}

       def create_container_for_user(self, user_id):
           if user_id not in self.user_containers:
               container = self.docker_client.containers.run(
                   "python:3.10", detach=True, tty=True, stdin_open=True
               )
               self.user_containers[user_id] = container
   ```

3. **Code Execution**

   Update the `/repl` and `/command` endpoints in `server/main.py` to route requests to the corresponding Docker container:

   ```python
   @app.post("/repl")
   def repl(request: CodeExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
       user_id = credentials.credentials
       container = container_manager.user_containers[user_id]

       # Execute the code in the Docker container
       code_output = container_manager.execute_code_in_container(container, request.code)
       response = {"result": code_output.strip()}

       return response

   @app.post("/command")
   async def command_endpoint(command_request: CommandExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
       user_id = credentials.credentials
       container = container_manager.user_containers[user_id]

       # Execute the command in the Docker container
       command_result = container_manager.execute_command_in_container(container, command_request.command)
       return {"result": command_result}
   ```

   Add the `execute_code_in_container` and `execute_command_in_container` methods to the `ContainerManager` class in `container_manager.py`:

   ```python
   class ContainerManager:
       # ...

       def execute_code_in_container(self, container, code_list):
           code_string = "\n".join(code_list)
           exec_command = f"python -c \"{code_string}\""
           result = container.exec_run(exec_command)
           return result.output.decode("utf-8")

       def execute_command_in_container(self, container, command):
           result = container.exec_run(command)
           return result.output.decode("utf-8")
   ```

4. **Error Handling**

   Update the `validate_token` function in `server/main.py` to handle errors when creating a Docker container:

   ```python
   def validate_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
       # ...

       try:
           container_manager.create_container_for_user(credentials.credentials)
       except Exception as e:
           raise HTTPException(status_code=500, detail=f"Failed to create Docker container: {str(e)}")

       return credentials
   ```

   Add error handling to the `/repl` and `/command` endpoints in `server/main.py`:

   ```python
   @app.post("/repl")
   def repl(request: CodeExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
       # ...

       if container is None:
           raise HTTPException(status_code=410, detail="Docker container not found or stopped")

       # ...

   @app.post("/command")
   async def command_endpoint(command_request: CommandExecutionRequest, credentials: HTTPAuthorizationCredentials = Depends(validate_token)):
       # ...

       if container is None:
           raise HTTPException(status_code=410, detail="Docker container not found or stopped")

       # ...
   ```

5. **Scalability**

   For future scalability, consider using a container orchestration system like Kubernetes to manage the Docker containers.

6. **Security**

   To improve security, follow the recommendations in the design specification, such as securely isolating Docker containers, setting resource limits, using a language-specific sandbox, and regularly updating Docker images.