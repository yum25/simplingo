import flask
from flask import Flask, Blueprint, current_app

from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.llama import *
from app.models.gpt3 import *
from app.models.t5 import *
from app.models.gemini import *
from app.credentials import *
from app.settings import print_colors as pc

model_bp = Blueprint('model_init', __name__)

model = None
model_backup = None

def init_model():
    """Initializes model based on config variables."""
    match current_app.config["B_MODEL"]:
        case "gpt2":
            return GPT2(), None
        case "gpt35":
            return GPT_35(key=OPEN_AI_KEY, version=OPEN_AI_VERSION, endpoint=OPEN_AI_ENDPOINT), None
        case "llama":
            return None, None
        case "gpt3":
            return None, None
        case "t5":
            return T5(), None
        case "gemini":
            if current_app.config["GEMINI_BACKUP"]:
                print(f"{pc.FMAG}Using backup for Gemini...{pc.ENDC}")
                return Bard(key=GEN_AI_KEY, backup=False), Bard(key=GEN_AI_KEY_BACKUP, backup=True)
            else:
                return Bard(key=GEN_AI_KEY, backup=False), None
        case default:
            print("Error: unrecognized model in init")
            return None, None