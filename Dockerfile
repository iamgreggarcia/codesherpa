    # Use the official Python base image
    FROM python:3.9

    # Set the working directory
    WORKDIR /

    # Install dependencies
    COPY requirements.txt ./
    RUN pip install --no-cache-dir -r requirements.txt

    # Copy the rest of the application code
    COPY . .

    # Expose the port the app runs on
    EXPOSE 8000

    # Start the application
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]