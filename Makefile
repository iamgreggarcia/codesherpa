.PHONY: build-docker-localserver build-docker-server run-docker-localserver run-docker-server remove-docker test test-docker-localserver test-docker-server dev-localserver dev-server

build-docker-localserver:
	docker build -f Dockerfile -t codesherpa:localserver .

build-docker-server:
	docker build -f Dockerfile.server -t codesherpa:server .

run-docker-localserver:
	docker run -p 3333:3333 --name localserver codesherpa:localserver

run-docker-server:
	docker run -p 8080:8080 --name server codesherpa:server

remove-docker:
	docker rm -f localserver server || true

test:
	pytest tests/

test-docker-localserver: build-docker-localserver
	docker run --rm codesherpa:localserver make test

test-docker-server: build-docker-server
	docker run --rm codesherpa:server make test

dev-localserver: remove-docker build-docker-localserver run-docker-localserver

start: remove-docker build-docker-server run-docker-server
