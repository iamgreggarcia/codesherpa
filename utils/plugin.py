
import json
import textwrap
import os

PORT = 3333


description_for_model = textwrap.dedent(f"""
    A plugin for interactive code execution, file management, and shell command execution.

   `/repl` endpoint
    - Execute Python code interactively for general programming, tasks, data analysis, visualizations, and more.
    - Pre-installed packages: matplotlib, seaborn, pandas, numpy, scipy, openpyxl.

    `/command` endpoint
    - Run terminal commands and interact with the filesystem, run scripts, and more.
    - Embed media files created or uploaded using `http://localhost:{PORT}/static/images/` URL in responses.
    - Access user-uploaded files in `static/uploads/` directory using `http://localhost:{PORT}/static/uploads/` URL.

    File management
    - Provide 'Upload file' link for users: http://localhost:{PORT}/upload
    - Access user-uploaded files in `static/uploads/`

""")

def load_manifest():
    """
    Load the AI plugin manifest from the `localserver/ai-plugin.json` file.

    This function loads the AI plugin manifest JSON file located at `localserver/ai-plugin.json` and modifies the
    `description_for_model` field to contain the value of the `description_for_model` variable. The function returns
    the loaded manifest as a dictionary.

    Raises:
        FileNotFoundError: If the `localserver/ai-plugin.json` file does not exist.
        json.JSONDecodeError: If the `localserver/ai-plugin.json` file contains invalid JSON.

    Returns:
        dict: The loaded AI plugin manifest.

    """
    with open("localserver/ai-plugin.json", "r") as f:
        manifest = json.load(f)
    manifest["description_for_model"] = description_for_model
    return manifest
