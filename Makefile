.PHONY: run release

SHELL := /bin/bash

run:
	go build && ./api-faker

release:
	mkdir -p release
	go build -o release/dsp-hub
	cd ui && npm run build
	cp -r static release/
	# rsync -r --progress release/ $(HOST)

