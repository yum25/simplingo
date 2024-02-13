import flask
from flask import Flask, Blueprint

import app.models
from app.model import model

bp = Blueprint('requests', __name__)

@bp.route('/get_text', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""

    # Not dealing with sessions for now because I genuinely don't think we need
    # info that persists between requests?
    translate = flask.request.args.get('translate', default=True, type=bool)
    simplify = flask.request.args.get('simplify', default=0, type=int)
    target = flask.request.args.get('target_lang', default="en", type=str)
    text = flask.request.args.get('text', default=None, type=str)

    kwargs = {"translate": translate,
              "simplify": simplify,
              "target": target}
    
    text, error = model.query(text, **kwargs)
    response = {"text": text, "error": error}
    return flask.jsonify(**response)

