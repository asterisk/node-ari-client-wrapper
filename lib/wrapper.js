/**
 *  ARI client wrapper that caches clients after connecting and starting a
 *  Stasis application.
 *
 *  @module tests-context
 *  @copyright 2014, Digium, Inc.
 *  @license Apache License, Version 2.0
 *  @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';

var ari = require('ari-client');
var Q = require('q');
var util = require('util');

var cache = {};

/**
 * Returns true if tests are currently running, false otherwise.
 */
function testsRunning() {
  var runningProcess = process.argv[1] || '';
  return ~runningProcess.search(/.+(?:grunt|mocha)$/) ? true: false;
}

/**
 * Returns an ARI client connected using the given config and starts a Stasis
 * application with the given stasis application name.
 *
 * @param {object} config - a config object to connect to ARI - must contain
 *                          url, username, and password
 * @param {string} stasisAppName - the Stasis application name
 * @param {function} callback - callback called once ARI client is loaded
 */
function getClient(config, stasisAppName, callback) {
  var cacheKey = util.format('%s-%s', config.url, stasisAppName);

  if (cache[cacheKey]) {
    callback(null, cache[cacheKey]);
  } else {
    // if grunt or mocha running, return test client, otherwise connect to ARI
    if (testsRunning()) {
      var client = {
        testClient: true
      };
      cache[cacheKey] = client;

      callback(null, client);
    } else {
      ari.connect(config.url, config.username,
                  config.password, function(err, client) {
        cache[cacheKey] = client;
        client.start(stasisAppName);

        callback(err, client);
      });
    }
  }
}

/**
 * Clears the entire cache.
 */
function clearCache() {
  cache = {};
}

/**
 * Clears a cache entry using the given config.
 *
 * @param {object} config - a config object to connect to ARI - must contain
 *                          url, username, and password
 * @param {string} stasisAppName - the Stasis application name
 */
function clearCacheEntry(config, stasisAppName) {
  var cacheKey = util.format('%s-%s', config.url, stasisAppName);

  delete cache[cacheKey];
}

module.exports = {
  getClient: getClient,
  clearCache: clearCache,
  clearCacheEntry: clearCacheEntry
};
