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
    #     self.queue = Queue()

    # def create(self, model, prompt, max_tokens):
    #     out = self.model.completions.create(
    #         model=model, prompt=prompt, max_tokens=max_tokens
    #     )
    #     self.queue.put(out)
    #     print(self.queue.empty())

    def generate(self, input, max_tokens=4096):
        # queue = Queue()
        # # watch = False
        # # alarm = threading.Timer(18.0, watchdog, args=(watch,))
        # # alarm.start()
        # print("GPT generating")
        # response = None
        # p = multiprocessing.Process(target=self.create, args=(self.deploy, input, max_tokens))
        # p.start()
        # # p.daemon = True
        # print("start")
        # time.sleep(4)
        # p.join()
        # print("join")
        # if p.is_alive():
        #     print('terminating')
        #     p.terminate()
        #     raise TimeoutError
        # print(self.queue.empty())
        # response = self.queue.get()
        # print('GPT done generating')
        # print(response.choices)
        
        # if response is None:
        #     print("hi")
        #     raise TimeoutError
        try:
            response = self.model.completions.create(
                model=self.deploy, prompt=input, max_tokens=max_tokens)
        except:
            raise TimeoutError
        # alarm.cancel()
        # if watch:
        #     print(f'{pc.BRED}Timed out generate{pc.ENDC}')
        #     raise TimeoutError

        return response.choices


    def summary(self, text, simplify):
        """Perform simple simplification query."""
        print(f'{pc.BBLU}Simplifying...{pc.ENDC}\n')
        prompt = "Paraphase this text simply: "

        try:
            response = self.generate(input=prompt + text)[0]
            # self.generate(input = prompt + text)
            # response = self.queue.get().choices[0]
        except:
            # try:
            #     time.sleep(5)
            #     response = self.generate(input=prompt + text)[0]
            # except:
            raise TimeoutError

        return response

    def translate(self, text, target, simplify):
        """Perform simple translation query."""
        if simplify:
            print(f'{pc.BBLU}Translating and simplifying...{pc.ENDC}\n')
        else:
            print(f'{pc.BBLU}Translating...{pc.ENDC}\n')
        print(target)
        prompt = "Translate this text into a simple paraphrase in " + target + ": " if simplify else "Translate this text into " + target + ": "
        print(prompt)
        print(text)
        try:
            print(prompt + text)
            response = self.generate(input=prompt + text)[0]
        except:
            # try:
            #     time.sleep(5)
            #     response = self.generate(input=prompt + text)[0]
            # except:
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
                response = self.translate(text=text, target=kwargs["target"], simplify=kwargs["simplify"])
                attempts += 1
                if attempts > 3:
                    raise ValueError
                try:
                    response = response.text
                    if not self.backup:
                        print(f"{pc.FCYN}Response: {response}{pc.ENDC}")
                    else:
                        print(f"{pc.FGRN}Response: {response}{pc.ENDC}")

                    if len(response) >= 2 * len(text):
                        print(f"{pc.FORN}Output too long, retrying{pc.ENDC}")
                        continue
                    done = True                    
                    return response, None
                except:
                    print(f'{pc.bred}GPT timed out{pc.ENDC}')
                    raise TimeoutError
            
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
                raise TimeoutError
        else:
            print(f'{pc.BRED}No args specified{pc.ENDC}')
            return text, "Note: no translate or simplify args specified\n"
