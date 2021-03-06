/**
 * ARI client wrapper that caches clients after connecting and starting a
 * Stasis application.
 *
 * @module tests-context
 * @copyright 2014, Digium, Inc.
 * @license Apache License, Version 2.0
 * @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';

var ari = require('ari-client');
var Q = require('q');
var util = require('util');

var cache = {};

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
  var deferred = Q.defer();
  var cacheKey = util.format('%s-%s', config.url, stasisAppName);

  if (cache[cacheKey]) {
    deferred.resolve(cache[cacheKey]);
  } else {
    var connect = Q.denodeify(ari.connect);
    connect(config.url, config.username, config.password)
      .then(function(client) {
        cache[cacheKey] = client;
        client.start(stasisAppName);

        deferred.resolve(client);
      })
      .catch(function(err) {
        deferred.reject(err);
      });
  }

  return deferred.promise.nodeify(callback);
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
