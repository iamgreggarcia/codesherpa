import pytest
from server.container_manager import ContainerManager

def test_container_manager_create_container_for_user():
    container_manager = ContainerManager()
    user_id = "test_user"

    # Test that the user container does not exist before creation
    assert user_id not in container_manager.user_containers

    # Test container creation for the user
    container_manager.create_container_for_user(user_id)
    assert user_id in container_manager.user_containers

    # Test that the same container is reused for the same user
    container = container_manager.user_containers[user_id]
    container_manager.create_container_for_user(user_id)
    assert container_manager.user_containers[user_id] == container

    # Clean up the created container
    container_manager.user_containers[user_id].remove(force=True)