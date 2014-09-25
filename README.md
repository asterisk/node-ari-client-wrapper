# ARI Client Wrapper

Wrapper for [ari-client](http://github.com/asterisk/node-ari-client) that caches clients and Stasis applications after first connecting to an ARI instance and starting a Stasis application. Passing in the same connection information and Stasis application name will return the same client within a given Node.js application.

# Installation

```bash
$ npm install ari-client-wrapper
```

# Usage

```JavaScript
var ariWrapper = require('ari-client-wrapper');
var config = {url: 'http://...', username: 'name', password: 'pass'};

ariWrapper.getClient(config, 'stasisAppName', function(err, client) {
  // use client
});
```

or with promises

```JavaScript
var ariWrapper = require('ari-client-wrapper');
var config = {url: 'http://...', username: 'name', password: 'pass'};

ariWrapper.getClient(config, 'stasisAppName')
  .then(function(client) {
    // use client
  })
  .catch(function(err) {
  });
```

the cache can be cleared entirely or by specific entry

```JavaScript
ariWrapper.clearCache();

ariWrapper.clearCacheEntry(config, 'stasisAppName');
```

# Development

After cloning the git repository, run the following to install the module and all dev dependencies:

```bash
$ npm install
$ npm link
```

Then run the following to run jshint and mocha tests:

```bash
$ grunt
```

jshint will enforce a minimal style guide. It is also a good idea to create unit tests when adding new features.

# License

Apache, Version 2.0. Copyright (c) 2014, Digium, Inc. All rights reserved.

