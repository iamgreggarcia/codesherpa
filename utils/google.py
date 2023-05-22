import os
from google.cloud import secretmanager

def get_secret(project_id, secret_id):

    # Create the Secret Manager client.
    client = secretmanager.SecretManagerServiceClient()

    # Build the secret version name.
    secret_version_name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"

    # Access the secret version.
    response = client.access_secret_version(request={"name": secret_version_name})

    # Return the decoded payload.
    return response.payload.data.decode('UTF-8')

SERVICE_AUTH_KEY = get_secret(os.environ['PROJECT_ID'], os.environ['SECRET_ID'])
