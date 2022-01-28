# Simple Survey Runner

With this app you can create surveys for specified number of responders.
Each responder gets individual code, which allows him to fill and update the survey. No one is able to corrupt the survey by sending many answers.


## Usage

At the begging, install dependencies and build frontend page:

```
npm install
npm run build
```

Now we want to declare questions for the survey.
We have to generate data files and fill them with questions.

`npm run generate-data`

A data folder will appear with the following files in it:

- answers.json - answers for the survey
- questions.json - array of pages, every page is an array of questions
- users.json - contains array of user names

Now we can start the server:

`npm run start`

Server will create `data/tokens.json` file. Copy each token and send it to the users.
When the user open the survey he have to paste the token, and he will be able to fill the survey

## Finish survey

On the `/results` page you can see the results of the survey. When the survey is finished, the results are saved in the `data/answers.json` file. You, and only you, can see choices of the other users
