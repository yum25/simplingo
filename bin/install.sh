#!/bin/bash

set -Eeuo pipefail
set -x

npm install

python -m venv env && source env/bin/activate
pip install -r requirements.txt

touch app/credentials.py
echo "GEN_AI_KEY = ''" > app/credentials.py
