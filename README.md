# Timeline
A free and public tool to organise your timeline charts entirely made with [Svelte](https://svelte.dev/), [Typescript](https://www.typescriptlang.org/) & 💖.

Take a look on [our website](https://timeline-chart.dev/) and give your feedback [here](https://github.com/besstiolle/Timeline/issues).

## Roadmap

Currently, there is no clear roadmap but we have done a lot of great stuff!

 * ✔️ Allow multiple charts for the same session
 * ✔️ Allow switching between your charts
 * ✔️ Improve rendering when the graph is spread over very long periods (> 15 months)
 * ✔️ Allow [.toml](https://github.com/toml-lang/toml) files's usage
 * ✔️ Guessing encoding of your files
 * ✔️ Allow users to save their charts remotely
 * ✔️ Share charts between user

But we continue to have lots of exciting ideas
 
 * 🔥 Improve tests coverage
 * 📅 Adding more control on data (length of string / validation of date / ...)
 * 📅 Implementing other types of charts (like gantt) [see #4](https://github.com/besstiolle/Timeline/issues/4)
 * 📅 New options to customize color [see #2](https://github.com/besstiolle/Timeline/issues/2)
 * 📅 Zooming in/out on your charts  [see #3](https://github.com/besstiolle/Timeline/issues/3)
 * ... [see more](https://github.com/besstiolle/Timeline/issues)

## Contributions

Thank you everybody for your help! 

* [Kevin Danezis](https://github.com/besstiolle)
* [CMCmike](https://github.com/CMCmike)

## Developing

```bash
npm install

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Running tests

Tests are located in /src/\__test\__ directory. They are made with [jest](https://jestjs.io/fr/)

```bash
npm run test

#or run the tests and refresh the test each time you modify a file
npm run test:watch

```

You can also ask for coverage 

```bash
npm run test --coverage
```

### Running with Netlify function & FaunaDb

[learn more about FaunaDb](./FAUNADB.md)

set your secret in your OS. Example below for Windows

```bash
SET FAUNADB_SECRET='someFaunaDbSecret'
SET FAUNADB_ENDPOINT='someFaunaDbEndpoint'
```

set your endpoint URL into the .env file

```.env
VITE_API_ENDPOINT_BASE_URL= https://localhost:8080/yourNetlifyEndPoint
```

install the netlify bundle

```bash
npm install netlify-cli -g
```
run the server

```bash
netlify dev
```

#### Bug with the netlify bundle

if you have : 

 > ◈ Netlify Dev could not connect to localhost:3000.
 > ◈ Please make sure your framework server is running on port 3000

 you may what to kill the process behind the port 3000

```bash
netstat -ano | findstr :3000
tskill  <THE PID>
```
