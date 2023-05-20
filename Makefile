.PHONY: build-docker run-docker remove-docker

build-docker:
	docker build --no-cache -t codesherpa:localserver .

run-docker:
	docker run -p 3333:3333 -v codesherpa-uploads:/app/static/images --name localserver codesherpa:localserver

remove-docker:
	docker rm -f localserver || true

dev: remove-docker build-docker run-docker
