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
    
# client = AzureOpenAI(
#     api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
#     api_version="2024-02-01",
#     azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
#     )
    
# deployment_name='REPLACE_WITH_YOUR_DEPLOYMENT_NAME' #This will correspond to the custom name you chose for your deployment when you deployed a model. Use a gpt-35-turbo-instruct deployment. 
    
# # Send a completion call to generate an answer
# print('Sending a test completion job')
# start_phrase = 'Write a tagline for an ice cream shop. '
# response = client.completions.create(model=deployment_name, prompt=start_phrase, max_tokens=10)
# print(start_phrase+response.choices[0].text)

class GPT_35():
    def __init__(self, key, version, endpoint, backup=False):
        print(f'{pc.FYEL}Loading model...{pc.ENDC}')
        self.model = AzureOpenAI(
            api_key=key,  
            api_version=version,
            azure_endpoint = endpoint
            )
    
        self.deploy = 'gpt-35-instruct-495' 
        self.backup = backup

    def generate(self, input, max_tokens=4096):
        response = self.model.completions.create(
            model=self.deploy, prompt=input, max_tokens=max_tokens)
        return response.choices


    def summary(self, text, simplify):
        """Perform simple simplification query."""
        print(f'{pc.BBLU}Simplifying...{pc.ENDC}\n')
        prompt = "Paraphase this text simply: "

        try:
            response = self.generate(input=prompt + text)[0]
        except:
            time.sleep(5)
            response = self.generate(input=prompt + text)[0]
        return response

    def translate(self, text, target, simplify):
        """Perform simple translation query."""
        if simplify:
            print(f'{pc.BBLU}Translating and simplifying...{pc.ENDC}\n')
        else:
            print(f'{pc.BBLU}Translating...{pc.ENDC}\n')

        prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        
        try:
            response = self.generate(input=prompt + text)[0]
        except:
            time.sleep(5)
            response = self.generate(input=prompt + text)[0]
        return response


    def query(self, text, **kwargs):
        """Perform query."""
        print(f'{pc.FBLU}Performing Bard query...{pc.ENDC}')

        if kwargs["translate"]:
            response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"])
            try:
                response = response.text
                if not self.backup:
                    print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                else:
                    print(f"{pc.FGRN}Response: {response}{pc.ENDC}")

                return response, None
            except:
                return None, "Some error, debug GPT output"
            
        elif kwargs["simplify"]:
            # Input is short enough it probably can't be simplified; TODO: qualify by language
            if len(text) <= 2:
                print(f"{pc.FORN}Short input {pc.FCYN + text + pc.ENDC + pc.FORN}, returning text...{pc.ENDC}")
                return text, None

            response = self.summary(text=text, simplify=kwargs["simplify"])
            try:
                response = response.text
                if not self.backup:
                    print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                else:
                    print(f"{pc.FGRN}Response: {response}{pc.ENDC}")

                if len(response) >= 1.7 * len(text):
                    print(f"{pc.FORN}Output too long, returning original text{pc.ENDC}")
                    return text, None

                return response, None
            except:
                return None, "Some error, debug GPT output"
        else:
            print(f'{pc.BRED}No args specified{pc.ENDC}')
            return text, "Note: no translate or simplify args specified\n"
