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

Test the software to make sure everything works as normal, before repeating the process for the next outdated package.
