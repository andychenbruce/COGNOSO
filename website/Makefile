WASM_DIR = ./root/wasm

.PHONY: website run clean wasm

all: server website

run: server website
	cargo run --bin server_frontend -- --port 1234 --root-serve-path ./root

server: 
	cargo build --package "server_frontend"

website: wasm
	cargo build --package "frontend_wasm" --target "wasm32-unknown-unknown"
	wasm-bindgen --target web ../target/wasm32-unknown-unknown/debug/frontend_wasm.wasm --out-dir ${WASM_DIR}

clean:
	rm -f ${WASM_DIR}/*
