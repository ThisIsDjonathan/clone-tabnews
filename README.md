# clone-tabnews

Implementação do https://www.tabnews.com.br para o https://curso.dev

## Starting local env

Start server: `npm run dev`

Run migrations: `npm run migration:up`

Stop services: `npm run services:stop`

## Test

Run tests once: `npm run test`

Run tests on every file save: `npm run test:watch`

Run tests on file save in the migrations directory `npm run test:watch -- migrations`

### Config Files

`.editorconfig` helps maintain the codestyle, https://editorconfig.org

`.nvmrc` specifies the Node.js version for this project

`.prettierignore` specifies the files [Prettier](https://prettier.io/docs/en/) should ignore

`jest.config.js` test framework configurations, https://jestjs.io/docs/configuration

`jsconfig.json` specifies the root files and the options for JavaScript, https://code.visualstudio.com/docs/languages/jsconfig
