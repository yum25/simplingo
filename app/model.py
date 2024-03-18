import flask
from flask import Flask, Blueprint, current_app

from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.llama import *
from app.models.gpt3 import *
from app.models.t5 import *
from app.models.gemini import *
from app.credentials import *

model_bp = Blueprint('model_init', __name__)

model = None

def init_model():
    """Initializes model based on config variables."""
    match current_app.config["B_MODEL"]:
        case "gpt2":
            return GPT2()
        case "gpt35":
            return None
        case "llama":
            return None
        case "gpt3":
            return None
        case "t5":
            return T5()
        case "gemini":
            return Bard(GEN_AI_KEY)
        case default:
            print("Error: unrecognized model")
            return None