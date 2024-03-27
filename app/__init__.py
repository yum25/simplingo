from flask import Flask
import flask

from config import Config
from app.settings import print_colors as pc
import app.model as md


def create_app():
    """Create app."""
    # Initialize app
    app = Flask(__name__)
    app.config.from_object(Config)

    with app.app_context():
        md.model, md.model_backup = md.init_model()
    if md.model is None:
        print(f"{pc.BRED} Error: no model initialized {pc.ENDC}")

    from app import models
    from app.requests import bp, get_text
    from app.model import model_bp
    from app import static

    app.register_blueprint(bp)
    app.register_blueprint(models.bp)
    app.register_blueprint(model_bp)

    @app.route('/', methods=['GET'])
    def index():
        return flask.send_from_directory('static/', 'consent-short.html')

    return app