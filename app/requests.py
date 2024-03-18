import flask
from flask import Flask, Blueprint, current_app

from app.model import model
from app.settings import print_colors as pc

bp = Blueprint('requests', __name__)

@bp.route('/get_text', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""

    # Check translate and simplify parameters
    translate = True if flask.request.args.get('translate', default="false", type=str) == "true" else False
    # TODO: use for tiered simplify
    # simplify = flask.request.args.get('simplify', default=0, type=int)
    simplify = True if flask.request.args.get('simplify', default="false", type=str) == "true" else False
    text = flask.request.args.get('text', default=None, type=str)
    target = None

    # Check target language
    if translate:
        lang = flask.request.args.get('target_lang', default="xx", type=str)
        target = current_app.config["APP_LANGS"].get(lang, None)
        if target is None:
            print(f"{pc.BRED} Error: target language {lang} unrecogniced\n{pc.ENDC}")
            response = {
                "text": None, 
                "error": f"Target language {lang} for translate not supported by {current_app.config['B_MODEL']} model"
                }
            return flask.jsonify(**response)
    

    kwargs = {"translate": translate,
              "simplify": simplify,
              "target": target}
        
    text, error = model.query(text, **kwargs)
    response = {"text": text, "error": error}
    return flask.jsonify(**response)

