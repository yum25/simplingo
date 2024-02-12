import flask
from flask import Flask

from models.gpt2 import *
from models.gpt3_5 import *
from models.llama import *
from models.gpt3 import *
from credentials import *

app = Flask(__name__)

gpt2 = True
gpt3 = False
gpt35 = True
llama = False

def query(prompt, **kwargs):
    # lang_prompt = "What language is the following in?" #if there are multiple...????

    pass

def models_init():
    """Set up relevant models."""
    if gpt2:
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
