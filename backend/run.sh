#!/usr/bin/env bash

cargo run --bin "server_backend" -- \
      --port 3000 \
      --database-path test.redb
