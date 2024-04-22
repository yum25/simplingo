from flask import Flask
import flask
import os
import pathlib

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
    
    from flask import request

    def shutdown_server():
        func = request.environ.get('werkzeug.server.shutdown')
        if func is None:
            raise RuntimeError('Not running with the Werkzeug Server')
        func()
        
    @app.route('/shutdown', methods=['GET'])
    def shutdown():
        shutdown_server()
        return 'Server shutting down...'
    
    @app.route('/edit', methods=['GET'])
    def sloppy_restart():
        with open('app/models/llama.py', 'w') as f:
            f.write('# hi\n')
        return flask.jsonify({'done': True})
    
    # with app.app_context():
    #     flask.redirect(flask.url_for('ping_model', model_num = 0))
    text = "light sob of breath Bloom sighed on the silent bluehued flowers"
    kwargs = {"translate": False,
              "simplify": True,
              "target": "English",
              "format": 'p'}
    error = None
     
    text, error = md.model.query(text, **kwargs)

    return app