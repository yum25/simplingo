import flask
from flask import Flask, Blueprint, current_app

from app.model import model, model_backup
from app.settings import print_colors as pc

bp = Blueprint('requests', __name__)

@bp.route('/get_text', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""
    print(f'{pc.FYEL}Request received...{pc.ENDC}')

    # Check translate and simplify parameters
    translate = True if flask.request.args.get('translate', default="false", type=str) == "true" else False
    # TODO: use for tiered simplify
    # simplify = flask.request.args.get('simplify', default=0, type=int)
    simplify = True if flask.request.args.get('simplify', default="false", type=str) == "true" else False
    text_in = flask.request.args.get('text', default=None, type=str)
    target = None
    format = flask.request.args.get('format', default='p', type=str)

    if text_in is None:
        text, error = None, "No text provided"
        response = {"text": text, "error": error}
        return flask.jsonify(**response)

    # Check target language
    if translate:
        lang = flask.request.args.get('target_lang', default="xx", type=str)
        target = model.langs.get(lang, None)
        if target is None: 
            print(f"{pc.BRED} Error: target language {lang} unrecognized\n{pc.ENDC}")
            text, error = None, f"Target language {lang} for translate not supported by {current_app.config['B_MODEL']} model"
            if not current_app.config["GPT_BACKUP"] or current_app.config["B_MODEL"] == 'gpt35':
                response = {"text": text, "error": error}
                return flask.jsonify(**response)


    kwargs = {"translate": translate,
              "simplify": simplify,
              "target": target}
    
    try:
        text, error = model.query(text_in, **kwargs)
    except:
        for i, mod in enumerate(model_backup):
            print(f"{pc.BORN}Retrying with backup model {i}...{pc.ENDC}")
            try:
                if translate and mod.langs.get(lang, None) is None:
                    print(f"{pc.BRED} Error: target language {lang} unrecognized\n{pc.ENDC}")
                    text, error = None, f"Target language {lang} for translate not supported"
                    continue
                kwargs['target'] = mod.langs.get(lang, None)

                text, error = mod.query(text_in, **kwargs)
                break
            except:
                print(f"{pc.BRED}{i}: Unable to return response, possible API limit{pc.ENDC}")
                text, error = None, "Unable to return response, possible API limit"
                # return flask.jsonify(**response)

    response = {"text": text, "error": error}
    return flask.jsonify(**response)

@bp.route('/ping_model/<model_num>', methods=['POST'])
def ping_model(model_num):
    """Startup ping model or something."""
    text = "light sob of breath Bloom sighed on the silent bluehued flowers"
    kwargs = {"translate": False,
              "simplify": True,
              "target": "English"}
    error = None
    try: 
        if model_num == '0':
            text, error = model.query(text, **kwargs)
        elif model_num == '1':
            if current_app.config["GEMINI_BACKUP"]:
                for mod in model_backup:
                    text, error = mod.query(text, **kwargs)
            else:
                print(f"{pc.FRED}Backup not available{pc.ENDC}")
        else:
            print(f"{pc.BRED}Attempt to ping unrecognized model{pc.ENDC}")
            return ('', 204)
    except:
        print(f"{pc.BRED}Model {model_num} failed to respond to ping{pc.ENDC}")
        print(error)
        return ('', 204)
    return ('', 204)

