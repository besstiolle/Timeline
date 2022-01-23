# Timeline
A free and public tool to organise your timeline charts entirely made with [Svelte](https://svelte.dev/), [Typescript](https://www.typescriptlang.org/) & 💖

take a look on [our website](https://timeline-chart.dev/) and give your feedback [here](https://github.com/besstiolle/Timeline/issues)

## Roadmap

Currently there is no clear roadmap but we have a lot of ideas !

 * Allowing multiple charts for a same session
 * Allowing switching between your chart
 * Improving rendering when the graph is spread over very long periods (> 15 months)
 * Improving tests coverage
 * Allowing [.toml](https://github.com/toml-lang/toml) files's usage
 * Guessing encoding of your files
 * Adding more control on data (lenght of string / validation of date / ...)

After that. we'll not be done

 * Authentification for user
 * Allowing users to save theirs charts remotely
 * Sharing charts between user
 * Implementing other types of charts (like gantt)


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

#or run the tests and refresh test each time you modify a file
npm run test:watch

```

You can also ask for coverage 

```bash
npm run test --coverage
```

