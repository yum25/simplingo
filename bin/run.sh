#!/bin/bash

set -Eeuo pipefail
set -x

source env/bin/activate
npm run build & python3 app.py