from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.gpt3 import *
from app.models.llama import *

from flask import Blueprint

bp = Blueprint('models', __name__)
