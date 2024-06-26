#!/bin/bash

set -Eeuo pipefail
set -x

if command -v python3 &> /dev/null; then
    PYTHON=python3
else 
    PYTHON=python
fi

npm install

$PYTHON -m venv env && source env/bin/activate
pip install -r requirements.txt

touch app/credentials.py
echo "GEN_AI_KEY = ''" > app/credentials.py
echo "GEN_AI_KEY_BACKUP = []" > app/credentials.py
echo "OPEN_AI_KEY = ''" > app/credentials.py
echo "OPEN_AI_VERSION = '2024-02-01'" > app/credentials.py
echo OPEN_AI_ENDPOINT = '' > app.credentials.py
