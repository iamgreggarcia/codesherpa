import docker

class ContainerManager:
    def __init__(self):
        self.docker_client = docker.from_env()
        self.user_containers = {}

    def create_container_for_user(self, user_id):
        if user_id not in self.user_containers:
            container = self.docker_client.containers.run(
                "python:3.10", detach=True, auto_remove=True)
            self.user_containers[user_id] = container