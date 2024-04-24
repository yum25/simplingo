import flask
from flask import Flask, Blueprint, current_app
from flask_mail import Mail, Message

from app.model import model, model_backup
from app.settings import print_colors as pc
from app.mail import mail
bp = Blueprint('requests', __name__)

@bp.route('/get_text', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""
    print(f'{pc.FYEL}Request received...{pc.ENDC}')

    # Check translate and simplify parameters
    translate = True if flask.request.args.get('translate', default="false", type=str) == "true" else False

    simplify = True if flask.request.args.get('simplify', default="false", type=str) == "true" else False
    text_in = flask.request.args.get('text', default=None, type=str)
    target = None
    format = flask.request.args.get('tagName', default='P', type=str)
    if format == 'P':
        format = 'p'
    elif format[0] == 'H':
        format = 'h'

    if text_in is None:
        text, error = None, "No text provided"
        response = {"text": text, "error": error}
        return flask.jsonify(**response)
    skip_flag = False

    # Check target language for main model
    if translate:
        lang = flask.request.args.get('target_lang', default="xx", type=str)
        target = model.langs.get(lang, None)
        # If wrong language, note error and retry; if no GPT, return
        if target is None: 
            print(f"{pc.BRED} Error: target language {lang} unrecognized by {current_app.config['B_MODEL']}\n{pc.ENDC}")
            text, error = None, f"Target language {lang} for translate not supported by {current_app.config['B_MODEL']} model"
            skip_flag = True

            if not current_app.config["GPT_BACKUP"] or current_app.config["B_MODEL"] == 'gpt35':
                response = {"text": text, "error": error}
                return flask.jsonify(**response)


    kwargs = {"translate": translate,
              "simplify": simplify,
              "target": target,
              "format": format}
    
    try:
        if not skip_flag:
            text, error = model.query(text_in, **kwargs)
        else:
            try:
                if translate and model_backup[-1].langs.get(lang, None) is None:
                    print(f"{pc.BRED} Error: target language {lang} unrecognized\n{pc.ENDC}")
                    text, error = None, f"Target language {lang} for translate not supported"
                kwargs['target'] = model_backup[-1].langs.get(lang, None)

                text, error = model_backup[-1].query(text_in, **kwargs)
            except:
                print(f"{pc.BRED}{i}: Unable to return response, possible API limit{pc.ENDC}")
                text, error = None, "Unable to return response, possible API limit"
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
              "target": "English",
              "format": 'p'}
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

@bp.route('/send_message', methods=['GET', 'POST'])
def send_message():
    """Send feedback message."""

    text = flask.request.args.get('text', default='', type=str)
    feedback = flask.request.args.get('option', default='None', type=str)

    message = Message(
        subject=f"Feedback: {feedback}",
        sender="simplingoteam@gmail.com",
        recipients=["simplingoteam@gmail.com"],
        body=text
    )
    mail.send(message=message)

    return('', 204)


