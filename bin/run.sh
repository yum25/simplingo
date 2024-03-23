#!/bin/bash

set -Eeuo pipefail
set -x

if command -v python3 &> /dev/null; then
    PYTHON=python3
else 
    PYTHON=python
fi

source env/bin/activate
npm run build & $PYTHON app.py