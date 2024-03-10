#!/usr/bin/env bash

./llama.cpp/build/bin/server \
    --model ~/models/yi-chat/yi-34b-chat.Q4_K_M.gguf \
    --n-gpu-layers 61 \
    --host 0.0.0.0 \
    --port 5678

