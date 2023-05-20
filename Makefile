.PHONY: build-docker run-docker remove-docker test test-docker

build-docker:
	docker build -t codesherpa:localserver .

run-docker:
	docker run -p 3333:3333 --name localserver codesherpa:localserver

remove-docker:
	docker rm -f localserver || true

test:
	pytest tests/

test-docker: build-docker
	docker run --rm codesherpa:localserver make test

dev: remove-docker build-docker run-docker