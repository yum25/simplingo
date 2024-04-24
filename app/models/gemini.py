import time
import google.generativeai as genai
from app.settings import print_colors as pc

# # if response fails, check
# response.prompt_feedback

# # access multiple answers with
# response.candidates

class Bard():
    def __init__(self, key, langs, backup=False):
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

        self.backup = backup
        self.langs = langs
        self.model = genai.GenerativeModel(model_name='gemini-pro',
                                           safety_settings=safety_settings)

    def lang_query(self, text):
        pass

    def summary(self, text, format):
        """Perform simple simplification query."""
        print(f'{pc.BBLU}Simplifying...{pc.ENDC}\n')
        if format == 'p':
            prompt = "Paraphase this text simply: "
        elif format == 'h':
            prompt = "Simplify this title: "
        elif format == 'l':
            print(f'{pc.BRED}Not yet implemented l type{pc.ENDC}')
            prompt = "Paraphase this text simply: "
        else:
            print(f'{pc.BRED}Unrecognized format {format}{pc.ENDC}')
            prompt = "Paraphase this text simply: "

        try:
            response = self.model.generate_content(prompt + text)
        except:
            time.sleep(5)
            response = self.model.generate_content(prompt + text)
        return response

    def translate(self, text, target, simplify, format):
        """Perform simple translation query."""
        if simplify:
            print(f'{pc.BBLU}Translating and simplifying...{pc.ENDC}\n')
        else:
            print(f'{pc.BBLU}Translating...{pc.ENDC}\n')

        if format == 'p':
            prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        elif format == 'h':
            prompt = "Translate this title into " + target + ": "
        elif format == 'l':
            print(f'{pc.BRED}Not yet implemented l type{pc.ENDC}')
            prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        else:
            print(f'{pc.BRED}Unrecognized format {format}{pc.ENDC}')
            prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "

        # prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        
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
            done = False
            attempts = 0
            while not done:
                response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"], format=kwargs["format"])
                try:
                    response = response.text
                    if not self.backup:
                        print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                    else:
                        print(f"{pc.FGRN}Response: {response}{pc.ENDC}")
                    
                    if ((len(response) >= 1.7 * len(text) and kwargs["format"] == 'h') or
                        (len(response) >= 2 * len(text) and kwargs["format"] == 'p')):
                        if attempts > 3:
                            print(f"{pc.FORN}Output too long, returning original text{pc.ENDC}")
                            return text, None
                        print(f"{pc.FORN}Output too long, retrying{pc.ENDC}")
                        continue

                    return response, None
                except:
                    raise ValueError
                    return None, "Query output blocked by model"
            
        elif kwargs["simplify"]:
            # Input is short enough it probably can't be simplified; TODO: qualify by language
            if len(text) <= 2:
                print(f"{pc.FORN}Short input {pc.FCYN + text + pc.ENDC + pc.FORN}, returning text...{pc.ENDC}")
                return text, None
            
            done = False
            attempts = 0
            while not done:
                response = self.summary(text=text, format=kwargs["format"])
                attempts += 1
                
                try:
                    response = response.text
                    if not self.backup:
                        print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                    else:
                        print(f"{pc.FGRN}Response: {response}{pc.ENDC}")

                    if ((len(response) >= 1.7 * len(text) and kwargs["format"] == 'h') or
                        (len(response) >= 2 * len(text) and kwargs["format"] == 'p')):
                        if attempts > 3:
                            print(f"{pc.FORN}Output too long, returning original text{pc.ENDC}")
                            return text, None
                        print(f"{pc.FORN}Output too long, retrying{pc.ENDC}")
                        continue

                    return response, None
                except:
                    raise ValueError
                    return None, "Query output blocked by model"

        else:
            print(f'{pc.BRED}No args specified{pc.ENDC}')
            return text, "Note: no translate or simplify args specified\n"

