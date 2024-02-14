from flask import Flask
import flask

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

    from app import models
    from app.requests import bp, get_text
    from app import static

    app.register_blueprint(bp)
    app.register_blueprint(models.bp)

    @app.route('/', methods=['GET'])
    def index():
        return flask.send_from_directory('static/', 'consent-short.html')
    
    # Purely for testing purposes
    # @app.route('/get_hi', methods=['GET'])
    # def get_hi():
    #     """Parses translation/ simplification request and returns appropriate text."""

    #     # Not dealing with sessions for now because I genuinely don't think we need
    #     # info that persists between requests?
    #     translate = flask.request.args.get('translate', default=True, type=bool)
    #     simplify = flask.request.args.get('simplify', default=0, type=int)
    #     target = flask.request.args.get('target_lang', default="en", type=str)
    #     text = flask.request.args.get('text', default=None, type=str)
    #     if translate:
    #         return str(simplify)
    #     else:
    #         return "bye"

    return app