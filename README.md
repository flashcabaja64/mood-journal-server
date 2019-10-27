# Mood Journal Server

This API server is the complement of my Mood Journal Client. This server is setup to return all entries of the user's data. This can add, delete, and edit entries in the API server.

## Endpoints

/api/entries returns all the entries the user has created in the client
/api/entries/:entry_id returns a specific entry in the server

Link to the client repo: https://github.com/flashcabaja64/mood-journal-client

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `https://github.com/flashcabaja64/mood-journal-server NEW-PROJECT-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.