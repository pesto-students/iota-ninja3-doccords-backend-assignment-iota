# Doccords-API
 It is an backend service for our website Doccords

## Getting started
These instructions will give you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on deploying the project on a live system.

## Prerequisites

Requirements for the software and other tools to build, test and push

we need node version 10.0.0 and above or you can download from here you can use node -v to check node version.

We need npm version 6.0.0 and above - this will be automatcally get installed while installing Node js using installer you can use npm -v to check npm version.

Install VS Code editor, We need VS Code IDE to start our development process.

need to install Prettier and ESLint as VS code package.

## Installing

In this section we will tell you step by step process, that will tell you how to get a development environment running

Clone this project repository using

### `git clone https://github.com/Elangodevguy/doccords-api.git`
after you clone doccords-api repo, move to the root of the project directory in your terminal

Install both dependency and dev-dependency using
### `npm install or npm i`

Setting up local .env to setup local .env, copy .env file from develop branch.

Run the app in development mode by 
### `npm start`

Open http://localhost:8000 on any tool like `Postman`.

## Other available scripts

### Linting
To lint our entire project, we can run
### `npm run lint`

we don't need to run the above commoand for every change in our file, VS code will automatically tell the places where ESLint rules are getting broke, thanks to `.eslintrc.js` which conatins all the standard rules for our project.

### Linting --fix
Most of our obovious `ESLint` errors will be fix by running the below command.
### `npm run lint-fix`

### Pretty code
To make our coding practices standard with all our team members, we are using `Prettier`
### `npm run format`

### Pre-commit hook
In this project we are using huskey and lint-staged to hook particular scripts to pre commit hook, whenever we do git commit -m 'message' huskey and lint-staged will call the pre-commit hook, from the hook we will call our scripts in the order of npm run lint, npm run lint-fix, npm run format if anyone of this script gets failed our commit will not happen, so this will give standard structure to our code base.

## Deployment
We have integrated `Circle CI\CD` tool to keep our deployment seamless,

Whenever we `push` something in any of our branch `Circle CI\CD` will get called and `Circle CI\CD` will run the `ESLint` and `Prettier` scripts if any of the script gets failed it will notify all the users in the repo.

but when we `push` something to develop branch it will go one step further and `Circle CI\CD` will call heroku-git hook and our project current `develop` branch will get deploy automatically in `Heroku`

# [api link](https://doccords-api.herokuapp.com/)
