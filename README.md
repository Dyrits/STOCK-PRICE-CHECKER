# STOCK-PRICE-CHECKER

## About The Project

Back-end project for the freeCodeCamp "Information Security" certification, per the original project description: the Stock Price Checker project. An Express server using Helmet's content security policy, with API routes in `routes/api.js` and functional tests run through Mocha and Chai.

The original README notes this repository was created from the freeCodeCamp boilerplate, with the project instructions at https://freecodecamp.org/learn/information-security/information-security-projects/stock-price-checker

### Built With

- Node.js / Express 4
- Helmet
- Mocha / Chai

## Getting Started

### Prerequisites

- Node.js 26 LTS (`nvm use`) and npm

### Installation

```sh
npm ci
```

Copy `sample.env` to `.env` and fill in the values.

### Running

```sh
npm start
```

The server listens on the port set in `.env`, or 3000 by default. With `NODE_ENV=test`, the functional tests run at startup.

### Tests

`npm test` runs the five existing functional tests with a test-only stock-price fixture. It covers single/two-stock responses, likes deduplication and relative likes without calling the public price proxy. The fixture restores the test likes file on exit. Importing the app in tests no longer starts a persistent listener; `npm start` still does.

The startup test runner and CLI use the same BDD interface. `NODE_ENV=test npm start` still runs the embedded freeCodeCamp tests, using the real proxy unless the test fixture is preloaded. Mocha's glob/minimatch dependencies are pinned to patched major versions through scoped overrides, verified with CLI and embedded test discovery.

Neither test mode proves live proxy availability or production durability of the JSON likes store.

## License

MIT is declared in `package.json`; no license file is present in this repository.

## Contact

Dyrits - https://github.com/Dyrits
