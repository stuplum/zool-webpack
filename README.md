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
    routePath: '/js/{module*}'
};

server.register({
        register: ZoolWebpack,
        options: options
    }
    , function (err) {
        if (err) throw err;
        server.start(function () {
            server.log("Hapi server started @ " + server.info.uri);
        });
    }
);
```

### Options:

* `debug`: used to print statements to the console. Defaults to `false`
* `src`: the directory to find the requested `.js` file. Defaults to `undefined`
* `routePath`: the route to register with hapijs. Defaults to `/js/{module*}`. 
