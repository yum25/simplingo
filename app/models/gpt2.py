from transformers import GPT2Tokenizer, GPT2LMHeadModel

class GPT2():
    def __init__(self):
        self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2-large')
        self.model = GPT2LMHeadModel.from_pretrained('gpt2-large')
        self.model.eval()

    def lang_query(self, text):
        """Return source language in ISO 639-1 code or return None."""

        query = ('You will be provided a text that may be in one or more languages. '
                 'If the majority of this text is in a single language, please return the ISO 639-1 language code. '
                 'If two or more languages make up large portions of the text, please return the word "None".\n'
                 'Here is the provided text: \n'
                )
        
        encoded = self.tokenizer.encode(query + text, return_tensors='pt')

        output = self.model.generate(encoded, max_length=10)
        text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)
        
        return text_output

    def summary(self, text):
        """ Adding a TL;DR token at the end of the text"""
        new_text = text + " TL;DR"
        len_input = len(new_text)

        encoded = self.tokenizer.encode(new_text, return_tensors='pt')
        length_encoded = len(encoded[0])

        output = self.model.generate(encoded, max_new_tokens = length_encoded, num_beams=5, no_repeat_ngram_size=2, top_k=50, top_p=0.95)
        text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)
        text_output = text_output[len_input:]

        return text_output
    
    def query(self, text, **kwargs):
        """Check source language, then perform query."""
        lang = self.lang_query(text)

        if lang == 'None':
            return None, "Multiple languages detected; do you wish to proceed with translation?"
        
        if kwargs["translate"] and kwargs["simplify"]:
            print("Error: simplify is temporarily disabled")
        elif kwargs["translate"]:
            print(f"translating {text}\n")
            query = ('Please translate the following into ' + kwargs["target"] + ':\n')
            encoded = self.tokenizer.encode(query + text, return_tensors='pt')
            print(len(encoded))
            output = self.model.generate(encoded, max_length=len(encoded))

            text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)
            print(f"done: {text_output}\n")
            
            return text_output, None
        elif kwargs["simplify"]:
            print("Error: temporarily disabled")
        else:
            print("Error bad query: translate and simplify args not specified")