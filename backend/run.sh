#!/usr/bin/env bash

cargo run --bin "server_backend" -- \
      --port 3000 \
      --database-path test.redb \
      --llm-runner "100.64.91.9:5678"
