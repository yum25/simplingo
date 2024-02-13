from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.llama import *
from app.models.gpt3 import *
from app.credentials import *

gpt2 = True
gpt3 = False
gpt35 = True
llama = False

if gpt2:
    model = GPT2()
elif gpt35:
    pass
elif llama:
    pass
elif gpt3:
    pass
else:
    print("Error: unrecognized model")