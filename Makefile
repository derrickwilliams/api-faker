.PHONY: run build release

SHELL := /bin/bash

run:build
	./tmp/api-faker

build:
	go build -o tmp/api-faker

release:
	mkdir release
	make build
	cp tmp/api-faker release/
	cd ui && npm run build
	cp -r ui/_dist release/static

