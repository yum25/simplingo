# SimpLingo
> [!WARNING]
> Currently in development, does not translate or simplify text yet, this extension only modifies the DOM in trivial ways.

An AI browser extension that helps you understand technical documents and translate between languages.

## Install and Build

Run ```npm install```. To initialize a dev environment, run ```npm run build``` to create a ```/dist``` directory. 

Go to [chrome://extensions](chrome://extensions) and press ```Load unpacked```, and select the recently built ```/dist``` directory. All of your changes to the source content will be reflected in real time in this build. To see new changes, reload the extension.

To start a development server with hot reload, run ```npm run dev```. This is preferable to building and running on chrome itself, since we do not have to reload the page and any changes will be automatically reflected on the page. 

## Dependencies

This project is built and bundled using [webpack](https://webpack.js.org) and [babel](https://www.npmjs.com/package/babel-loader). This comes with multiple benefits: real time build refresh, ES6 style imports/exports, and the ability to modularize files. 

We use [TypeScript](https://www.typescriptlang.org) to write the extension itself, and [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for compatibility between multiple browsers.


For the requisite Python environment, run the following (with appropriate modification):  ```python -m venv env``` to create an environment, ```source env/bin/activate``` to activate it, ```pip install -r requirements.txt``` to install necessary packages. 

To run the Flask app, simply run the ```app.py``` script. It should run on localhost by default and be able to accept HTTP requests where parameters are formatted as URL query parameters.
You can test sending requests to the server using curl, such as with a command like this: ```curl 'http://localhost:5000/get_text?translate=false&simplify=true&text=Ineluctable%20modality%20of%20the%20visible&target_lang=en'```

To set the model used by the backend for testing purposes, go to models/__init__.py (this will later be changed to use a config variable, probably). For the credentials for GPT-3.5+ and Gemini, create a credentials file to hold the keys. Your file tree should look like this:

app
├── __init__.py
├── credentials.py
├── model.py
├── models
│   ├── __init__.py
│   ├── gemini.py
│   ├── gpt2.py
│   ├── gpt3.py
│   ├── gpt3_5.py
│   ├── llama.py
│   ├── model_testing.ipynb
│   └── t5.py
├── requests.py
└── static/...

and credentials.py should contain ```OPENAI_KEY = '[key]'``` and ```GEN_AI_KEY = '[key]'```, replacing ```[key]``` with the appropriate key. (You can leave them empty if you're not using them.)