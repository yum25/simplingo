# SimpLingo
> [!WARNING]
> Currently in development. 

An AI browser extension that helps you understand technical documents and translate between languages.

## Install and Build

**Important Note:** You can ignore the below steps and run the following: 
- First, run the ```install.sh``` script that's in the ```bin/``` folder. Next,  configure the credentials file, inside the ```app/``` folder and enter the credentials by setting ```OPENAI_KEY = '[key]'``` and/ or ```GEN_AI_KEY = '[key]'``` as appropriate, replacing ```[key]``` with the key. 
- Next, run the ```run.sh``` script from the ```bin/``` folder. This will get your application running and create a ```/dist``` directory. Finally, go to [chrome://extensions](chrome://extensions) and press ```Load unpacked```, and select the recently built ```/dist``` directory.
All of your changes to the source content will be reflected in real time in this build. To see new changes, reload the extension. 

**Important Note Pt.2:** The T5 model does not work unless you have an external GPU. 

**Important Note Pt.3:** If you are running this with a backup API key for Gemini, please enter your key in the ```GEN_AI_KEY_BACKUP``` variable in the credentials file and set ```GEMINI_BACKUP = True``` in the config.

### Frontend
1. Run ```npm install```. To initialize a dev environment, run ```npm run build``` to create a ```/dist``` directory. 

2. Go to [chrome://extensions](chrome://extensions) and press ```Load unpacked```, and select the recently built ```/dist``` directory. All of your changes to the source content will be reflected in real time in this build. To see new changes, reload the extension.

3. To start a development environment with both the bundled browser extension and the backend flask api, run ```npm run dev```. 

### Backend
1. Run the following commands to create a Python environment and install necessary packages:
```sh
python -m venv env && source env/bin/activate
pip install -r requirements.txt
```

2. To configure the model used by the backend, see ```config.py```. Support for reading API keys off the environment and into the config is under work; currently, the option of using a credentials file is implemented for simplicity. To configure the credentials file, create ```credentials.py``` inside the ```app/``` folder and enter the credentials by setting ```OPENAI_KEY = '[key]'``` and/ or ```GEN_AI_KEY = '[key]'``` as appropriate, replacing ```[key]``` with the key. (This only applies for Gemini and GPT-3+.) Your file tree should look like this:
```
app
├── __init__.py
├── credentials.py
├── model.py
├── models/...
├── requests.py
└── static/...
```

3. To run the Flask app, simply run the ```app.py``` script. It should run on localhost by default and be able to accept HTTP requests where parameters are formatted as URL query parameters.
You can test sending requests to the server using curl, such as with a command like this:
```sh
curl "http://localhost:5000/get_text?"\
"translate=false&simplify=true&text=Ineluctable%20"\
"modality%20of%20the%20visible&target_lang=en"
```

4. [Optional] To test if the models are online, use the ```ping.sh``` script in ```bin/```. To run with a backup model for the Gemini API, do the following: add your second API key to the ```GEN_AI_KEY_BACKUP``` variable in your credentials and set ```GEMINI_BACKUP = True``` in your config. If you are not in debug mode, restart the Flask app; otherwise, the app will be automatically reloaded with the backup model. Instructions for generating an API key below.

## Dependencies

This project is built and bundled using [webpack](https://webpack.js.org) and [babel](https://www.npmjs.com/package/babel-loader). This comes with multiple benefits: real time build refresh, ES6 style imports/exports, and the ability to modularize files. 

We use [TypeScript](https://www.typescriptlang.org) to write the extension itself, and [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for compatibility between multiple browsers.

The backend is implemented with Flask, and depending on the model used in the backend will require LLM API library support, Hugging Face modules, and/ or GPU support. Following the installation instructions or running the installation script should take care of necessary packages and dependencies. 

The project has only been tested on Python 3.11; further version details will be supplemented in future updates.

To generate an API key for Gemini, see https://makersuite.google.com/app/apikey. 

## Known issues

- Additional note, we have found that occasionally the API is occasionally unresponsive at first when starting up, and it helps to prompt it with a very short request (such as the test HTTP request specified above). We are still investigating why this occurs, as it occurs infrequently and is a difficult error to replicate and thus diagnose. 
- Similarly, we have seen that the Gemini API occasionally generates internal errors that have nothing to do with our code and may be tied to rate limits or internal model errors; we have been unable to find an input or scenario that consistently replicates this error either, so it is similarly difficult to replicate and diagnose. In the case that it occurs, we have found that simply waiting for a time before trying again seems to help. However, as we have only managed to incur this error once, we're as of yet unsure of the best way to deal with this. 
