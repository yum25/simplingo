from app.models.gpt2 import *
from app.models.gpt3_5 import *
from app.models.llama import *
from app.models.gpt3 import *
from app.models.t5 import *
from app.models.gemini import *
from app.credentials import *

gpt2 = False
gpt3 = False
gpt35 = False
llama = False
t5 = False
gemini = True

if gpt2:
    model = GPT2()
elif gpt35:
    pass
elif llama:
    pass
elif gpt3:
    pass
elif t5:
    model = T5()
elif gemini:
    model = Bard(GEN_AI_KEY)
else:
    print("Error: unrecognized model")