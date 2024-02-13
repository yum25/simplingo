from flask import Flask

from config import Config
from app.model import model


def create_app():
    """Create app."""
    # Initialize app
    app = Flask(__name__)
    # TODO: deal with config
    app.config.from_object(Config)

    if model is None:
        print("Error: no model initialized")

    import app.models
    from app import requests

    app.register_blueprint(requests.bp)

    return app