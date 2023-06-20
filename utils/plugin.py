
import json
import textwrap
import os

PORT = 3333


description_for_model = textwrap.dedent(f"""
    codeherpa is a Dockerized FastAPI application that provides a persistent REPL (Read-Eval-Print Loop) session, 
    command execution, and the ability to interact with the container filesystem in Python. C++ and Rust are available for code execution,
    but are stateless and do not persist between requests. codesherpa runs on ubuntu:22.04. It has many 
    
    ## `/repl` endpoint
    Through the `/repl` endpoint, you can execute Python code interactively. For example, whenever requested by a user for 
    assistance with tasks, data analysis and visualizations, creating images, learning programming, etc., you might use the `/repl` endpoint. 
    By default, the following Python packages are installed in the Docker container: matplotlib,seaborn,pandas,numpy,scipy,openpyxl,scikit-learn

    To execute code, send a POST request to the `/repl` endpoint containing an escaped JSON object with a 'code' key for the code and a 'language' key for the language 
    in which the code should be executed. For example, to execute the Python code `print('hello world')`, send a POST request to the `/repl` endpoint
    with the following escaped JSON object: `{{\\\"code\\\": \\\"print('hello world')\\\", \\\"language\\\": \\\"python\\\"}}`. Always present the user with the code block formatted code used in the request.
    
    When a user asks to upload a file, or mention they have a file they want you to analyze, or that they have a question 
    regarding a spreadsheet, a dataset, etc., present an 'Upload file' link to the user. This link 
    should point to the url: http://localhost:{PORT}/upload. When a user asks for data analysis, proactively examine the 
    uploaded file for its contents. Specifically, you should 
        1. Understand the file type (e.g., CSV, Excel, JSON, etc.) and determine the best way to read it.
        2. Immediately analyze the shape of the data (e.g., 'I see you've uploaded a CSV file with 100 rows and 5 columns.), write a concise summary of the data (e.g., 'Here is a summary of the data: ...'), and present visualizations of the data (e.g., 'Here are some visualizations of the data: ...').
            a. Create informative and beautiful visualizations. You have several Python packages at your disposal, including matplotlib and seaborn.
        3. Present key insights from the data (e.g., 'Here are some key insights from the data: ...').
        4. Ask the user if they have any questions about the data or if they would like you to perform any additional analysis.

    ## `/command` endpoint
    To run a terminal command and interact with the Docker container filesystem, send an escaped JSON object with a 'command' key containing the terminal command to the `/command` endpoint. The `/command` endpoint is useful if you need to install a python package, download a file, or perform other tasks that require a terminal command. An example request for executing a command (in escaped JSON format) looks like this:

    `{{\\\"command\\\": \\\"pip install pandas\\\"}}`.

    When presenting a media file created via a command, code execution, created by you, or uploaded by the user, use the corresponding 
    `http://localhost:{PORT}/static/images/` URL to embed it in the response. That is, you should show images in your responses. 
    For example, for an image named 'example.png' saved in the static/images directory, you can present it in your response like this: 'Here is <the description of the image>: ![example.png](http://localhost:{PORT}/static/images/example.png)'. Another example would be to show a graph of the data you analyzed and saved in the `/static/uploads` folder.
    
    User uploaded files (e.g., if a user asks about their files or a specific file) will be saved in the `static/uploads/` 
    directory. To access them, use the corresponding `http://localhost:{PORT}/static/uploads/` URL. For instance, for an image 
    named 'example.png' uploaded by the user, you can present it in your response like this: 'Here is <the description of 
    the image>: ![example.png](http://localhost:{PORT}/static/uploads/example.png)'.
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
