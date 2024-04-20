# Set base image (host OS)
FROM python:3.11-bullseye

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /flask_app

# Copy the dependencies file to the working directory
COPY requirements-docker.txt .

# Install any dependencies
RUN pip install -r requirements-docker.txt

# Copy application source
COPY app-docker/ ./app/

# Copy the content of the local src directory to the working directory
COPY app.py .
COPY config.py .

# Specify the command to run on container start
CMD [ "python", "./app.py" ]