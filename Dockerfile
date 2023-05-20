FROM python:3.10 as requirements-stage

WORKDIR /tmp

RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry config virtualenvs.create false \
    && poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.10

WORKDIR /app

# Create directory for uploads
RUN mkdir -p /app/static/images

# Set PYTHONPATH
ENV PYTHONPATH=/app

COPY --from=requirements-stage /tmp/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app/

# Just for debugging, let's list the contents of /app and /app/localserver
RUN ls -al /app && ls -al /app/localserver

CMD ["python", "-c", "import localserver.main; localserver.main.start()"]