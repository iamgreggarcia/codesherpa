.PHONY: build-docker run-docker-localserver run-docker-server remove-docker test run-frontend run

build-docker:
	docker build -t codesherpa .

run-docker-localserver:
	docker rm -f localserver || true
	docker run -p 3333:3333 --name localserver codesherpa python3 -c "import localserver.main; localserver.main.start()"

run-docker-server:
	docker rm -f server || true
	docker run -p 8080:8080 --name server codesherpa python3 -c "import server.main; server.main.start()"

remove-docker:
	docker rm -f localserver server || true

test:
	docker run --rm codesherpa pytest tests/

run-frontend:
	cd frontend && pnpm dev &

run:
	cd frontend && pnpm dev &
	docker compose up

dev:
	poetry run dev

start:
	poetry run start
