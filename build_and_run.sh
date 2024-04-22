#!/bin/bash

set -Eeuo pipefail
set -x

if command -v python3 &> /dev/null; then
    PYTHON=python3
else 
    PYTHON=python
fi

# Build webpack
npm install
# Build backend with docker
docker build -t flask-container .

# Run frontend and docker image
npm run build &  docker run -p 5000:5000 flask-container
