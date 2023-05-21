# Base Ubuntu Image
FROM ubuntu:22.04

# Update and install necessary compilers/interpreters
RUN apt-get update && apt-get install -y \
    python3.10 \
    python3-pip \
    g++ \
    curl \
    make \
    git

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Set up working directory
WORKDIR /app

# Copy Python dependencies and install them
COPY ./pyproject.toml ./poetry.lock* /tmp/
RUN pip install poetry \
    && cd /tmp \
    && poetry config virtualenvs.create false \
    && poetry export -f requirements.txt --output requirements.txt --without-hashes \
    && pip install --no-cache-dir --upgrade -r /tmp/requirements.txt

# Install testing tools
RUN pip install pytest pytest-cov pytest-asyncio

# Create directory for uploads
RUN mkdir -p /app/static/images

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Copy over all the other files
COPY . /app/
