.PHONY: run release

SHELL := /bin/bash

HOST := root@192.168.0.13
DIR := /root/api-faker

run:
	go build && ./api-faker

release:
	mkdir -p release
	go build -o release/dsp-hub
	cd ui && npm run build
	cp -r static release/
	# rsync -r --progress release/ $(HOST)

