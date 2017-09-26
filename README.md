# Browser-specific API Gateway for the Concha application

## Package Locking
All packages are installed at a specific version, to ensure an exact, reproducible `node_modules` tree. This is achieved in two ways. Firstly, the `package.json` lists directly dependent packages at their exact version number. **No carets or tildes**. Secondly, the repo includes an `npm-shrinkwrap.json` file which lists all **deeply-nested** dependent packages with their corresponding version numbers. When `npm install` is executed, the `npm-shrinkwrap.json` file will be referenced to ensure all packages are installed at the versions specified.

Updating packages should be done in a controlled manner. First:

```
$ npm outdated  # Lists outdated packages  
```

Next modify the `package.json` file to list the new package version. Then:

```
$ npm update <package_name>  # Update individual package  
$ npm shrinkwrap  # Rebuild the npm-shrinkwrap.json to incorporate the new package version  
```

Test the software to make sure everything works as normal, before repeating the process for the next outdated package. Ensure that the updated `npm-shrinkwrap.json` is saved in version control.

## Style Guide
All code syntax should be written in the configuration-less [JavaScript Standard Style](https://standardjs.com). New code will not be merged into `develop` unless it passes the linting rules defined by this style. Code linting can be manually performed as follows:

```
$ npm run lint  
```

If errors are found by the linter, you can fix them as follows:

```
$ npm run fix-style  
```
