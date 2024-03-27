#!/bin/bash

# Kick the models to make sure they're alive

set -Eeuo pipefail
set -x

curl "http://localhost:5000/get_text?"\
"translate=false&simplify=true&text=Ineluctable%20"\
"modality%20of%20the%20visible&target_lang=en"

curl -X POST "http://localhost:5000/ping_model/0"
curl -X POST "http://localhost:5000/ping_model/1"