from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.gpt3 import *
from app.models.llama import *
from app.models.t5 import *
from app.models.gemini import *
from app.settings import *

from flask import Blueprint

bp = Blueprint('models', __name__)
