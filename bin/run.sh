#!/bin/bash

set -Eeuo pipefail
set -x

npm run build & python app.py