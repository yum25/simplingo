import time
import google.generativeai as genai

# # if response fails, check
# response.prompt_feedback

# # access multiple answers with
# response.candidates

class Bard():
    def __init__(self, key):
        print('Loading model...')
        apikey = key
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
        genai.configure(api_key=apikey)

        self.model = genai.GenerativeModel(model_name='gemini-pro',
                                           safety_settings=safety_settings)

    def lang_query(self, text):
        pass

    def summary(self, text, simplify):
        """Perform simple simplification query."""

        prompt = "Paraphase this text simply: "

        # TODO: actually make this sane
        try:
            response = self.model.generate_content(prompt + text)
        except:
            time.sleep(5)
            response = self.model.generate_content(prompt + text)
        return response

    def translate(self, text, target, simplify):
        """Perform simple translation query."""
        if simplify:
            print("Translating and simplifying...\n")
        else:
            print("Translating...\n")

        prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        
         # TODO: actually make this sane
        try:
            response = self.model.generate_content(prompt + text)
        except:
            time.sleep(5)
            response = self.model.generate_content(prompt + text)
        return response


    def query(self, text, **kwargs):
        """Perform query."""
        print("Performing Bard query...")

        if kwargs["translate"]:
            response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"])
            try:
                response = response.text
                print(response)

                return response, None
            except:
                return None, "Query output blocked by model"
            
        elif kwargs["simplify"]:
            print("Simplifying...\n")

            # TODO: enable for tiered simplification
            # if kwargs["simplify"] == 0:
            #     return text, None
            response = self.summary(text=text, simplify=kwargs["simplify"])
            try:
                response = response.text
                print(response)

                return response, None
            except:
                return None, "Query output blocked by model"
        else:
            print("No args specified")
            return text, "Note: no translate or simplify args specified\n"

