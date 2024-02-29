import google.generativeai as genai
from flask import current_app

# # if response fails, check
# response.prompt_feedback

# # access multiple answers with
# response.candidates

class Bard():
    def __init__(self, key):
        print('Loading model...')
        apikey = key
        genai.configure(api_key=apikey)
        self.model = genai.GenerativeModel('gemini-pro')

    def lang_query(self, text):
        pass

    def summary(self, text, simplify):
        """Perform simple simplification query."""

        prompt = "Paraphase this text simply: "
        return self.model.generate_content(prompt + text).text

    def translate(self, text, target):
        """Perform simple translation query."""

        prompt = "Translate this text into " + target + ": "
        return self.model.generate_content(prompt + text).text

    def query(self, text, **kwargs):
        """Perform query."""
        print("Performing Bard query...")

        if kwargs["translate"] and kwargs["simplify"]: # is not None and kwargs["simplify"] > 0:
            print("Translating and simplifying...\n")
            print("Error: combined function temporarily disabled - no support for concurrent translate and simplify yet\n")
            return None, None
        
        elif kwargs["translate"]:
            print("Translating...\n")

            response = self.translate(text=text, target=kwargs["target"])
            print(response)

            return response, None
        elif kwargs["simplify"]:
            print("Simplifying...\n")

            # TODO: enable for tiered simplification
            # if kwargs["simplify"] == 0:
            #     return text, None

            response = self.summary(text, kwargs["simplify"])
            print(response)

            return response, None
        else:
            print("No args specified")
            return text, "Note: no translate or simplify args specified\n"

