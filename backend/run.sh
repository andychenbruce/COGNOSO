#!/usr/bin/env bash

cargo run --bin "server_backend" -- \
      --port 3000 \
      --database-path test.redb \
      --llm-runner "127.0.0.1:5678" \
      --qdrant-addr "http://127.0.0.1:6334/" \
      --embedder-path /home/chadguy123/models/all-MiniLM-L6-v2
