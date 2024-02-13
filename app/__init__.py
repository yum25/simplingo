from flask import Flask

from config import Config
from api.model import model


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    if model is None:
        print("Error: no model initialized")

    import api.models

    return app