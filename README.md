# zool-webpack

A Hapi.js plugin for compiling and serving JS files stylesheets using [webpack](https://github.com/webpack/webpack).

### Overview

This plugin will create a single (configurable) route on the server that will respond to requests for js files. 

The plugin will map the request to a js file or directory in the configured `src` directory. The plugin will then use webpack to compile the javascript into a single JS bundle. 


### Example usage:

```shell
$ npm install zool-webpack --save
```

```javascript
var Hapi = require('hapi');
var ZoolWebpack = require('zool-webpack')

var server = new Hapi.Server();
server.connection({ port: 1337 });

var options = {
    debug: true,
    src: true,
    routePath: '/js/{module*}',
    entryNameTemplate: '[name].module'
};

server.register({
        register: ZoolWebpack,
        options: options
    }
    , function (err) {
        if (err) throw err;
        server.start(function () {
            server.log('Hapi server started @ ' + server.info.uri);
        });
    }
);
```

### Options:

* `debug`: used to print statements to the console. Defaults to `false`
* `context`: The base directory (absolute path!) for resolving the src option. Defaults to `undefined` - mandatory option
* `src`: the directory to find the requested `.js` file. Defaults to `undefined` - mandatory option
* `routePath`: the route to register with hapijs. Defaults to `/js/{module*}`. 
* `entryNameTemplate`: this determines the name of the entry file that webpack will use to compile a standalone component. Defaults to `[name]`.

#### entryNameTemplate (string || function)

##### string
```
var options = {
    ...
    entryNameTemplate: '[name].module'
};
```

Given a module name of 'foo', using the string template would result in the compiler looking for:

* foo.module
* foo.module.js
* foo.module/index
* foo.module/index.js

##### function
```
var options = {
    ...
    entryNameTemplate: name => `some.${name}.component`
};
```

Given a module name of 'bar', using the string template would result in the compiler looking for:

* some.bar.component
* some.bar.component.js
* some.bar.component/index
* some.bar.component/index.js