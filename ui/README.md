# React Stylus Webpack Base Project

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](http://mit-license.org/2016)

a base project using react, stylus and webpack, just clone it for further development.

## Usage

- development

```bash
npm run dev # content base is _dev
```

- build

```bash
# first, we need to build vendors chunk
# webpack.config.vendors.js defines what vendors are
# if vendors hasn't changed, we don't need this step
npm run build-vendors
# then, we build app chunk
npm run build
# at this point, _dist contains the full code and can be served by web servers like nginx
```

- lint

```bash
# first need to install eslint, babel-eslint and eslint-plugin-react globally
npm run lint
```


## Features

- Webpack DLL Plugin to split vendors and app

- Hot Module Replacement

- Stylus css preprocessor

- Autoprefix production code

- Builtin linter support (eslint)

## License

Released under the [MIT license](http://mit-license.org/2016)
