#!/usr/bin/env bash

cd qdrant;
rm -fr storage
rm -fr snapshots

cargo run --release -- \
      --disable-telemetry \

