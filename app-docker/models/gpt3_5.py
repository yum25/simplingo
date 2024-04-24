# from openai import OpenAI
# client = OpenAI()

# completion = client.chat.completions.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "system", "content": "You are a translator."},
#     {"role": "user", "content": "Hello!"}
#   ]
# )

# print(completion.choices[0].message)

import os
import time
from openai import AzureOpenAI
from app.settings import print_colors as pc
import threading
from queue import Queue
import multiprocessing

def watchdog(q):
    print(f'{pc.BPUR}Watchdog expired.{pc.ENDC}')
    q = True


class GPT_35():
    def __init__(self, key, version, endpoint, langs, backup=False):
        print(f'{pc.FYEL}Loading model...{pc.ENDC}')
        self.model = AzureOpenAI(
            api_key=key,  
            api_version=version,
            azure_endpoint=endpoint,
            timeout=5.0, max_retries=4
            )
    
        self.deploy = 'gpt-35-instruct-495' 
        self.backup = backup
        self.langs = langs
        self.sinolangs = ['Japanese',
                          'Korean',
                          'Min Nan',
                          'Vietnamese',
                          'Wu dialect',
                          'Cantonese',
                          'Simplified Chinese',
                          'Traditional Chinese']

    def generate(self, input, max_tokens=4096):
        try:
            response = self.model.completions.create(
                model=self.deploy, prompt=input, max_tokens=max_tokens)
        except:
            raise TimeoutError

        return response.choices


    def summary(self, text, format):
        """Perform simple simplification query."""
        print(f'{pc.BBLU}Simplifying...{pc.ENDC}\n')
        if format == 'p':
            prompt = "Paraphase this text simply: "
        elif format == 'h':
            prompt = "Simplify this title: "
        elif format == 'l':
            print(f'{pc.BRED}Not yet implemented l type{pc.ENDC}')
            prompt = "Paraphrase this text simply: "
        else:
            print(f'{pc.BRED}Unrecognized format {format}{pc.ENDC}')
            prompt = "Paraphrase this text simply: "

        try:
            response = self.generate(input=prompt + text)[0]
        except:
            raise TimeoutError

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

        try:
            response = self.generate(input=prompt + text)[0]
        except:
            print(f'{pc.BRED}GPT translate timed out{pc.ENDC}')
            raise TimeoutError

        return response


    def query(self, text, **kwargs):
        """Perform query."""
        print(f'{pc.FBLU}Performing GPT query...{pc.ENDC}')

        if kwargs["translate"]:
            done = False
            attempts = 0
            while not done:
                response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"], format=kwargs["format"])
                attempts += 1
                try:
                    response = response.text
                    if not self.backup:
                        print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                    else:
                        print(f"{pc.FGRN}Response: {response}{pc.ENDC}")

                    if ((len(response) >= 1.7 * len(text) and kwargs["format"] == 'h') or
                        (len(response) >= 2 * len(text) and kwargs["format"] == 'p')):
                        if kwargs["target"] in self.sinolangs:
                            if len(response) >= 3 * len(text) and kwargs["format"] == 'h':
                                continue
                        print(f"{pc.FORN}Output too long, retrying{pc.ENDC}")
                        continue

                    return response, None
                except:
                    print(f'{pc.bred}GPT timed out{pc.ENDC}')
                    raise TimeoutError
            
        elif kwargs["simplify"]:
            # Input is short enough it probably can't be simplified; TODO: qualify by language
            if len(text) <= 2:
                print(f"{pc.FORN}Short input {pc.FCYN + text + pc.ENDC + pc.FORN}, returning text...{pc.ENDC}")
                return text, None

            done = False
            attempts = 0
            while not done:
                response = self.summary(text=text, format=kwargs["format"])
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
                    raise TimeoutError

        else:
            print(f'{pc.BRED}No args specified{pc.ENDC}')
            return text, "Note: no translate or simplify args specified\n"
