import flask
from flask import Flask, Blueprint

from models.gpt2 import *
from models.gpt3_5 import *
from models.llama import *
from models.gpt3 import *
from credentials import *
from app.model import model

bp = Blueprint('requests', __name__)


@bp.route('/get_text/', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""

    # Not dealing with sessions for now because I genuinely don't think we need
    # info that persists between requests?
    translate = flask.request.get('translate', default=True, type=bool)
    simplify = flask.request.get('simplify', default=0, type=int)
    target = flask.request.get('target_lang', default="en", type=str)
    text = flask.request.get('text', default=None, type=str)

    kwargs = {"translate": translate,
              "simplify": simplify,
              "target": target}
    
    text, error = model.query(text, kwargs)
    response = {"text": text, "error": error}
    return flask.jsonify(**response)
