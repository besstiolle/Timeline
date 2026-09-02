# Timeline

A free and public tool to organise your timeline charts entirely made with [Svelte](https://svelte.dev/), [Typescript](https://www.typescriptlang.org/) & 💖.

Take a look on [our demo](https://timechart.dev/) and give your feedback [here](https://github.com/besstiolle/Timeline/issues).

<p align="center"><img src="https://github.com/user-attachments/assets/5dedcc9d-f4e9-4ba1-8cfc-31e910513994" alt="Preview of the homepage" width="80%"/></p>
<p align="center"><img src="https://github.com/user-attachments/assets/73df1294-57f6-420c-ae28-94848192f09e" alt="Preview of a customized Timeline" width="80%"/></p>

## Main features

- ✔️ Allow multiple charts for the same session
- ✔️ Allow switching between your charts
- ✔️ The chart can be adapted to suit both short and long timelines
- ✔️ Export and import your creations as CSV or TOML files
- ✔️ Take a screenshot and download a high-fidelity image to your computer
- ✔️ There are no limits on your creations, whether in terms of the number of timelines, tasks or milestones. 
- ✔️ You can choose to keep your data entirely offline or to save your creations on the remote server
- ✔️ You can share your creations with different levels of access rights: read-only, read & write, or owner rights
- ✔️ **free, just like a free beer** – whether on [our demo](https://timechart.dev/) instance or via self-hosting using our [Docker image](https://hub.docker.com/r/besstiolle/timechart)

<p align="center"><video src="https://github.com/user-attachments/assets/10c52e27-b543-4655-9d0d-bc84ea53b110" autoplay loop muted width="100%"></video></p>
<p align="center">Most of the controls can be operated using the mouse</p>
<p align="center"><video src="https://github.com/user-attachments/assets/411717aa-717d-4810-b842-a9e1057a49e7" autoplay loop muted width="100%"></video></p>
<p align="center">Export / Import and share your creations using a simple security mechanism</p>
<p align="center"><video src="https://github.com/user-attachments/assets/d9e826e8-c086-4a51-86bc-712135c90874" autoplay loop muted width="100%"></video></p>
<p align="center">Simply take a screenshot of your timeline in light mode or dark mode</p>


## Roadmap

We continue to have lots of exciting ideas

- 📅 Adding more control on data (length of string / validation of date / ...)
- 📅 Implementing other types of charts (like gantt) [see #4](https://github.com/besstiolle/Timeline/issues/4)
- 📅 New options to customize color [see #2](https://github.com/besstiolle/Timeline/issues/2)
- 📅 Zooming in/out on your charts [see #3](https://github.com/besstiolle/Timeline/issues/3)
- ... [see more](https://github.com/besstiolle/Timeline/issues)

## Contributions

Thank you everybody for your help!

- [Kevin Danezis](https://github.com/besstiolle)
- [CMCmike](https://github.com/CMCmike)

### Developing

```bash
npm install

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Running tests

Tests are located in /src/\_\_test\_\_ directory. They are made with [jest](https://jestjs.io/fr/)

```bash
npm run test

#or run the tests and refresh the test each time you modify a file
npm run test:watch

```

You can also ask for coverage

```bash
npm run coverage
```

### Check code & linter

```bash
npx sv check
npx eslint
```

## Demo

If you'd like to try out TimeChart, or if you don't have the knowledge (or inclination) to host the application yourself, we suggest you use the official [TimeChart](https://timechart.dev/) server.

Advantages :

- ✅ Free and available (as long as I can to pay the bills)
- ✅ You don't have to worry about maintenance (version upgrades, server support, backup).

Keep in mind that the data you enter are stored with me.

## Installation

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

# The data-website-id code from umami
#TIMECHART_ANALYTICS_UMAMI_CODE=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
#TIMECHART_ANALYTICS_UMAMI_SCRIPT=https://cloud.umami.is/script.js

# The data-domain code from plausible
#TIMECHART_ANALYTICS_PLAUSIBLE_CODE=timechart.dev
#TIMECHART_ANALYTICS_PLAUSIBLE_SCRIPT=https://plausible.io/js/script.js

# Do we need to show the version of the install
TIMECHART_SHOW_VERSION=TRUE
```

#### Explanations of environmental variables

| KEY                                  | Value                             | Explanations                                                                                                                                                                                                                                                               |
| :----------------------------------- | :-------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DB_LOCATION                          | /your/own/directory/to/db         | The directory containing the database. By default, the docker configuration relies on the use of docker volumes to enable you to back up your database efficiently from the host machine. You can choose another method if you feel comfortable enough with this paradigm. |
| TIMECHART_ANALYTICS_UMAMI_CODE       | string                            | The data-website-id code from umami. [More informations here](https://umami.is/)                                                                                                                                                                                           |
| TIMECHART_ANALYTICS_UMAMI_SCRIPT     | https://cloud.umami.is/script.js  | The umami script url. [More informations here](https://umami.is/)                                                                                                                                                                                                          |
| TIMECHART_ANALYTICS_PLAUSIBLE_CODE   | string                            | The data-domain code from plausible. [More informations here](https://plausible.io) 🇪🇺                                                                                                                                                                                     |
| TIMECHART_ANALYTICS_PLAUSIBLE_SCRIPT | https://plausible.io/js/script.js | The plausible script url. [More informations here](https://plausible.io) 🇪🇺                                                                                                                                                                                                |
| TIMECHART_SHOW_VERSION               | boolean (default = TRUE)          | Display the installed version and provide a visual notification when an update is available                                                                                                                                                                                |

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
  -e TIMECHART_ANALYTICS_UMAMI_CODE=aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa \
  -e TIMECHART_SHOW_VERSION=TRUE \
  besstiolle/timechart:latest
```

Explanations:

- **`--rm --name timechart_latest`** _Optional_ : sets a clear name for the container and deletes it once the container has been switched off. (No data loss is expected if you use the option `-v /your/own/directory/to/db:/app/db`)
- **`-p 3000:3000`** _Optional_ : Used to expose port 3000. You can configure to expose another port. For example, exposing port 8080 would give: `-p 8080:3000`
- **`-v /your/own/directory/to/db:/app/db`** : Defines the location of your database on the host disk.
- **`-e VAR_NAME=VAR_VALUE`** : Used to initialise the value of an environment variable. Please refer to the dedicated explanation table.

## Translation

We've been using [inlang](https://inlang.com/) and its equivalent [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) to translate this software since TimeChart version 0.2.0.

The following translations are currently available:

- ✅ English
- ✅ Français

Don't hesitate to push a PR to improve translation coverage.

### Add a new language

To add a new language, create the corresponding file in `./messages/` (example: es.json for Spanish)
Modify the `project.inlang/settings.json` file and add the code in the `locales` node (example: `es` for Spanish)

```json
  "locales": [
    "en",
    "fr"
  ],
```

```json
    "locales": [
    "en",
    "fr",
    "es"
  ],
```

### Update translations, complete missing translations

Open the language file in `./messages/` (example: ./messages/es.json for Spanish) and add the missing key or modify the text.

```json
  "example_message": "Hola {username}",
```

### Useful commands

Validate the entire translation structure:

```bash
npx @inlang/cli validate --project project.inlang
```

Help translate missing text (this requires proofreading after all)

```bash
npx @inlang/cli machine translate --project project.inlang
```
