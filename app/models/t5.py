# pip install accelerate
from transformers import T5Tokenizer, T5ForConditionalGeneration



class T5():
    def __init__(self):
        print("Loading model...")
        self.tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-large")
        self.model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-large", device_map="auto")
        self.model.eval()

    # def lang_query(self, text):
    #     """Return source language in ISO 639-1 code or return None."""

    #     query = ('You will be provided a text that may be in one or more languages. '
    #              'If the majority of this text is in a single language, please return the ISO 639-1 language code. '
    #              'If two or more languages make up large portions of the text, please return the word "None".\n'
    #              'Here is the provided text: \n'
    #             )
        
    #     encoded = self.tokenizer.encode(query + text, return_tensors='pt').input_ids.to("cuda")

    #     output = self.model.generate(encoded, max_length=10)
    #     text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)

        
    #     return text_output

    def summary(self, text):
        """Query model for summarization/ simplification/ paraphrase output."""

        # Leftover from attempting to few-shot prompt the model; refer to testing notebook for more (though it's admittedly a mess)

        # sample_prompt = (
        #     "Hugo Wolf has a unique place in the history of 19th-century song. Acutely aware of following in the wake of such songwriting giants as Schubert and Schumann and bowed down (for a while) by the weight of his own conflicted Wagner-worship, he found his way to a voice of his own."
        #     " What we find in his songs is a merger of Schubertian formal containment with a post-Wagnerian harmonic language all Wolf’s own. When he first came to Vienna in 1875 to study at the Conservatory, he would experiment at his aunt’s parlor organ with novel ways of getting from one key to the next; "
        #     "expelled from the conservatory in 1877 (but he considered the training old-fashioned), he became an autodidact, imitating Schumann, Liszt, and Wagner until he could fly on his own. When he began composing in earnest, he was able to penetrate the depths of some of Germany’s most profound poetry—his "
        #     "preference was for the verse of earlier generations, not the works of his own generation. In little more than twenty years, he created a repertory of songs unlike anyone else’s, most of them contained in anthologies that each focus on a single poet or collection of folk poems.\n\n\n"
        #     "What is going on?\n"
        #     "Hugo Wolf was a 19th-century songwriting composer who overcame the influence of preceding great composers to create his own style. He taught himself by experimenting with harmony and learning from other great composers, and he preferred music of previous times. His songs are very unique, many focusing on single poets."
        # )

        # input_text = "Text:\n\n\n" + sample_prompt + "\n\n\n" + "Text:\n\n\n" + text + "\n\n\n" + "What is going on?\n"
        # input_text = "Briefly summarize this text: " + text

        query = "Briefly summarize this text: "
        out = ""
        # TODO: Sloppy text parsing to split into chunks; communicate with Marie about sending
        # chunked input to backend for better parsing, may vary depending on model backend used
        # Currently attempts to split input into sentences and query the model for each; result 
        # is slow process
        # Print statements are for debugging purposes and will be removed hopefully at later date
        for t in text.split(". "):
            print(f"Simplify target: {query + t}\n\n")
            # Currently uses GPU for implementation
            # TODO: add CPU support (auto detect device)
            input_ids = self.tokenizer(query + t, return_tensors="pt").input_ids.to("cuda")

            output = self.model.generate(input_ids, max_new_tokens = 50).cpu()
            text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)\
        
            print(f"Output: {text_output}")
            out = out + text_output + " "


        return out
    
    def query(self, text, **kwargs):
        """Check source language, then perform query."""
        
        # TODO: translate is currently a string and not a bool due to URL complications
        # simplify is an int
        # These changes have not yet been reflected in GPT2 backend code
        if kwargs["translate"] == "true" and kwargs["simplify"] != 0:
            print("Translating and simplifying...\n")
            print("Error: combined function temporarily disabled - no support for translate\n")
            return None, None
        
            lang = self.lang_query(text)

            if lang == 'None':
                return None, "Multiple languages detected; do you wish to proceed with translation?"
        elif kwargs["translate"]:
            # TODO: implement translate function if we want to keep this functionality
            print("Translating...\n")
            print("Error: temporarily disabled - no support for translate\n")
            return text, "Error: temporarily disabled"
        
            lang = self.lang_query(text)

            if lang == 'None':
                return None, "Multiple languages detected; do you wish to proceed with translation?"
        
            print(f"translating {text}\n")
            query = ('Please translate the following into ' + kwargs["target"] + ':\n')
            encoded = self.tokenizer.encode(query + text, return_tensors='pt')
            print(len(encoded))
            output = self.model.generate(encoded, max_length=len(encoded))

            text_output = self.tokenizer.decode(output[0], skip_special_tokens=True)
            print(f"done: {text_output}\n")
            
            return text_output, None
        elif kwargs["simplify"]:
            print("Simplifying...\n")
            if kwargs["simplify"] == 0:
                return text, None
            print(f"Simplifying{text}")
            te = self.summary(text)
            print(f"New text: {te}\n")
            return te, None
        else:
            return text, "Note: no translate or simplify args specified"
        
