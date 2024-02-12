from transformers import GPT2Tokenizer, GPT2Model

class GPT2 ():
    def __init__(self):
        self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2-large')
        self.model = GPT2Model.from_pretrained('gpt2-large')

    def lang_query(self, text):
        """Return target language oin ISO 639-1 code."""

    
    def query(self, **kwargs):
        if kwargs.translate and kwargs.simplify:
            print("Error: simplify is temporarily disabled")
        elif kwargs.translate:
            pass
        elif kwargs.simplify:
            print("Error: temporarily disabled")
        else:
            print("Error bad query: translate and simplify args not specified")