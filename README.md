# SimpLingo
> [!WARNING]
> Currently in development, does not translate or simplify text yet, this extension only modifies the DOM in trivial ways.

An AI browser extension that helps you understand tehcnical documents and translate between languages.

## Install and Build

Run ```npm install```. To initialize a dev environment, run ```npm run build``` to create a ```/dist``` directory. 

Go to [chrome://extensions](chrome://extensions) and press ```Load unpacked```, and select the recently built ```/dist``` directory. All of your changes to the source content will be reflected in real time in this build. To see new changes, reload the extension.

## Dependencies

This project is built and bundled using [webpack](https://webpack.js.org) and [babel](https://www.npmjs.com/package/babel-loader). This comes with multiple benefits: real time build refresh, ES6 style imports/exports, and the ability to modularize files. 

We use [TypeScript](https://www.typescriptlang.org) to write the extension itself, and [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for compatibility between multiple browsers.
