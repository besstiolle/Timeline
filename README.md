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

### Developing

```bash
npm install

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Running tests

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

## Demo

If you'd like to try out TimeChart, or if you don't have the knowledge (or inclination) to host the application yourself, we suggest you use the official [TimeChart](https://timeline-chart.dev/) server.

Advantages :

 * ✅ Free and available (as long as I can to pay the bills)
 * ✅ You don't have to worry about maintenance (version upgrades, server support, backup).

Keep in mind that the data you enter are stored with me.


## Installation

If you'd like to try out TimeChart, or if you don't have the knowledge (or inclination) to host the application yourself, we suggest you use the official [TimeChart] server (https://timeline-chart.dev/).

Advantages: 
 * ✅ Free (as long as I can pay the bills)
 * ✅ You don't have to worry about maintenance (version upgrades, server support, backup).

Keep in mind that the data you enter is stored with me.

### Docker Compose [Recommended]

The easiest way to install TimeChart is to use our docker-compose.yml file.

#### Step 1: Download files

Create a directory of your choice (eg: `./timechart`) to store the `docker-compose.yml` and `.env` files.

```bash
mkdir ./timechart
cd ./timechart
```

Download the `docker-compose.yml` and `.env` files by running these commands

```bash
wget -O docker-compose.yml https://github.com/besstiolle/Timeline/releases/latest/download/docker-compose.yml
wget -O .env https://github.com/besstiolle/Timeline/releases/latest/download/example.env
```

If you wish to download the files via your web browser, remember to rename example.env to .env.

#### Step 2: Fill in the .env file with your own values

```
# You can find documentation for all the supported env variables at https://github.com/besstiolle/Timeline

# The location where your database is stored
DB_LOCATION=/your/own/directory/to/db
```

Fill in the **`DB_LOCATION`** value with the location of your future database. Now think about how you're going to save it.

#### Step 3: Start the container.

Still in the directory of your choice (eg: `./timechart`), start the containers with these commands


```bash
docker compose up -d
```

### Docker

If you don't want to use Docker Compose, you can launch the application with a single command line:

```bash
docker run \
  --rm --name timechart_latest \
  -p 3000:3000 \
  -v /your/own/directory/to/db:/app/db \
  besstiolle/timechart:latest
```

Explanations:

 * **`--rm --name timechart_latest`** *Optional* : sets a clear name for the container and deletes it once the container has been switched off. (No data loss is expected if you use the option `-v /your/own/directory/to/db:/app/db`)
 * **`-p 3000:3000`** *Optional* : Used to expose port 3000. You can configure to expose another port. For example, exposing port 8080 would give: `-p 8080:3000`
 * **`-v /your/own/directory/to/db:/app/db`** : Defines the location of your database on the host disk.
