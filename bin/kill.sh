#!/bin/bash

# Kill the flask app; use when model API is timing out

set -Eeuo pipefail
set -x

kill -9 $(lsof -t -i:5000)