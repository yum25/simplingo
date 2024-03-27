import time
import google.generativeai as genai
from app.settings import print_colors as pc

# # if response fails, check
# response.prompt_feedback

# # access multiple answers with
# response.candidates

class Bard():
    def __init__(self, key):
        print(f'{pc.FYEL}Loading model...{pc.ENDC}')
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
        print(f'{pc.BBLU}Simplifying...{pc.ENDC}\n')
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
            print(f'{pc.BBLU}Translating and simplifying...{pc.ENDC}\n')
        else:
            print(f'{pc.BBLU}Translating...{pc.ENDC}\n')

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
        print(f'{pc.FBLU}Performing Bard query...{pc.ENDC}')

        if kwargs["translate"]:
            response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"])
            try:
                response = response.text
                print(f"{pc.FCYN}Response: {response}{pc.ENDC}")

                return response, None
            except:
                return None, "Query output blocked by model"
            
        elif kwargs["simplify"]:
            # TODO: enable for tiered simplification
            # if kwargs["simplify"] == 0:
            #     return text, None

            # Input is short enough it probably can't be simplified; TODO: qualify by language
            if len(text) <= 2:
                print(f"{pc.FORN}Short input {pc.FCYN + text + pc.ENDC + pc.FORN}, returning text...{pc.ENDC}")
                return text, None

            response = self.summary(text=text, simplify=kwargs["simplify"])
            try:
                response = response.text
                print(f"{pc.FCYN}Response: {response}{pc.ENDC}")

                if len(response) >= 2 * len(text):
                    print(f"{pc.FORN}Output too long, returning original text{pc.ENDC}")
                    return text, None

                return response, None
            except:
                return None, "Query output blocked by model"
        else:
            print(f'{pc.BRED}No args specified{pc.ENDC}')
            return text, "Note: no translate or simplify args specified\n"

