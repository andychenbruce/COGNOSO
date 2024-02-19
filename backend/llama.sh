#!/usr/bin/env bash

./llama_runner/build/bin/server \
    --port 5678 \
    --host "0.0.0.0" \
    --n-gpu-layers 64 \
    --model ~/job/models/yi-34b-chat.Q4_K_M.gguf 
    
