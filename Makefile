SHELL := /bin/bash

install:
	@go install -ldflags "-X main.appVersion=`cat VERSION`"
.PHONY: install

run: install
	@api-faker sample-config.yml
