import flask
from flask import Flask

from models import *
from credentials import *

app = Flask(__name__)

def query(prompt, **kwargs):
    lang_prompt = "What language is the following in?" #if there are multiple...????

    pass

@app.route('/get_text/', methods=['GET'])
def get_text():
    """Parses translation/ simplification request and returns appropriate text."""

    translate = flask.request.get('translate', default=True, type=bool)
    simplify = flask.request.get('simplify', default=0, type=int)
    text = flask.request.get('text', default=None, type=str)


    model = ""

    kwargs = {"model": model,
              "translate": translate,
              "simplify": simplify}
    
    text = query(text, kwargs)
    response = flask.jsonify({"text": text})
