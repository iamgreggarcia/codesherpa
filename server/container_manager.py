import docker

class ContainerManager:
    def __init__(self):
        self.docker_client = docker.from_env()

    def create_container(self):
        container = self.docker_client.containers.run(
            "python:3.10", detach=True, auto_remove=True, mem_limit="128m", pids_limit=100, network_disabled=True)
        return container
