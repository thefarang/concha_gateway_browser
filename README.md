# Browser-Only API Gateway Microservice for the Concha Distributed Application

[![Build Status](https://travis-ci.org/thefarang/concha_gateway_browser.svg)](https://travis-ci.org/thefarang/concha_gateway_browser)

## Package Locking
All packages are installed at a specific version, to ensure an exact, reproducible `node_modules` tree. This is achieved in two ways. Firstly, the `package.json` lists directly dependent packages at their exact version number. **No carets or tildes**. Secondly, the repo includes an `npm-shrinkwrap.json` file which additionally lists all **deeply-nested** dependent packages with their corresponding version numbers. When `npm install` is executed, the `npm-shrinkwrap.json` file will be referenced to ensure all packages are installed at the versions specified.


## Style Guide
All code syntax should be written in the configuration-less [JavaScript Standard Style](https://standardjs.com). New code will not be merged into `develop` unless it passes the linting rules defined by this style. Code linting can be manually performed as follows:

```
$ npm run lint  
```

If errors are found by the linter, you can fix them as follows:

```
$ npm run fix-style  
```


## Testing
Code should be developed only after the test-cases for the code have been written. Unit tests should be added to the `tests` directory, and can be as follows:

```
$ npm run test  
```
