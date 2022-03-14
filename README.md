## Description

Check github API every x minutes for repositories with the most number of stars

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints

```bash
- GET /github-repos[?search=name]
list of all repositoriaes from the database matching the search name if provided

- GET /github-repos/:id
get repository by id

- GET /github-repos/reset/
force synchronization database with github api and reset current timer

- GET /github-repos/settings
get update interval from settings

- POST /github-repos/settings
body {"updateIntervalMinutes": 60}
change update interval
```
