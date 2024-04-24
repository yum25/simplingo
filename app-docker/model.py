import flask
from flask import Flask, Blueprint, current_app

from app.models.gpt3_5 import *
from app.models.gemini import *
from app.credentials import *
from app.settings import print_colors as pc

model_bp = Blueprint('model_init', __name__)

model = None
model_backup = None

def init_model():
    """Initializes model based on config variables."""
    if OPEN_AI_KEY is None or GEN_AI_KEY is None:
        print(f'{pc.BRED}Error: check keys in credentials{pc.ENDC}')
        exit(1)
    gem_langs = current_app.config["GEM_LANGS"]
    gpt_langs = current_app.config["GPT_LANGS"]
    match current_app.config["B_MODEL"]:
        # case "gpt2":
        #     return GPT2(), None
        case "gpt35":
            if current_app.config["GEMINI_BACKUP"]:
                model_list = []
                model_list.append(Bard(key=GEN_AI_KEY, langs=gem_langs, backup=True))
                print(f"{pc.FMAG}Using Gemini backup with GPT...{pc.ENDC}")
                return GPT_35(key=OPEN_AI_KEY, version=OPEN_AI_VERSION, endpoint=OPEN_AI_ENDPOINT, langs=gpt_langs), model_list
            else:
                return GPT_35(key=OPEN_AI_KEY, version=OPEN_AI_VERSION, endpoint=OPEN_AI_ENDPOINT, langs=gpt_langs), None
        # case "llama":
        #     return None, None
        # case "gpt3":
        #     return None, None
        # case "t5":
        #     return T5(), None
        case "gemini":
            model_list = []
            if current_app.config["GEMINI_BACKUP"]:
                for i in range(current_app.config["GEMINI_BACKUP_NUMBER"]):
                    print(f"{pc.FMAG}Adding Gemini backup for Gemini...{pc.ENDC}")
                    try:
                        model_list.append(Bard(key=GEN_AI_KEY_BACKUP[i], langs=gem_langs, backup=True))
                    except:
                        print(f"{pc.BRED}Not enough keys provided{pc.ENDC}")
                        raise IndexError
                
            if current_app.config["GPT_BACKUP"]:
                print(f"{pc.FMAG}Adding GPT backup for Gemini...{pc.ENDC}")
                model_list.append(GPT_35(key=OPEN_AI_KEY, version=OPEN_AI_VERSION, endpoint=OPEN_AI_ENDPOINT, langs=gpt_langs, backup=True))
            if len(model_list) == 0:
                return Bard(key=GEN_AI_KEY, langs=gem_langs, backup=False), None
            return Bard(key=GEN_AI_KEY, langs=gem_langs, backup=False), model_list
        case default:
            print("Error: unrecognized model in init")
            return None, None