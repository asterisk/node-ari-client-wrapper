/**
 * ARI client wrapper unit tests.
 *
 * @module tests-context
 * @copyright 2014, Digium, Inc.
 * @license Apache License, Version 2.0
 * @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';

/*global describe:false*/
/*global before:false*/
/*global after:false*/
/*global it:false*/

var mockery = require('mockery');
var assert = require('assert');

var mockeryOpts = {
  warnOnReplace: false,
  warnOnUnregistered: false,
  useCleanCache: true
};

describe('wrapper', function() {

  before(function(done) {
    mockery.enable(mockeryOpts);
    var mock = {
      connect: function(url, username, password, callback) {
        var client = {
          testClient: true,
          start: function() {}
        };

        callback(null, client);
      }
    };
    mockery.registerMock('ari-client', mock);

    done();
  });

  after(function(done) {
    mockery.disable();

    done();
  });

  it('should cache clients', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName, function(err, client) {
      assert(err === null);
      assert(client);
      assert(client.testClient === true);

      ariWrapper.getClient(config, stasisAppName, function(err, cachedClient) {
        assert(client === cachedClient);
        assert(err === null);
        assert(client);
        assert(client.testClient === true);

        done();
      });
    });
  });

  it('should support promise style as well', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName)
      .then(function(client) {
        assert(client);
        assert(client.testClient === true);

        return client;
      })
      .then(function(client) {
        return ariWrapper.getClient(config, stasisAppName)
          .then(function(cachedClient) {
            assert(client === cachedClient);
            assert(client);
            assert(client.testClient === true);

            done();
          });
      })
      .done();
  });

  it('should return different clients for different apps', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName, function(err, client) {
      assert(err === null);
      assert(client);
      assert(client.testClient === true);

      stasisAppName = 'otherTest';
      ariWrapper.getClient(config, 'otherTest', function(err, cachedClient) {
        assert(client !== cachedClient);
        assert(err === null);
        assert(client);
        assert(client.testClient === true);

        done();
      });
    });
  });

  it('should return different clients for different urls', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName, function(err, client) {
      assert(err === null);
      assert(client);
      assert(client.testClient === true);

      config = {url: 'http://othertest', username: 'test', password: 'user'};
      ariWrapper.getClient(config, stasisAppName, function(err, cachedClient) {
        assert(client !== cachedClient);
        assert(err === null);
        assert(client);
        assert(client.testClient === true);

        done();
      });
    });
  });

  it('should support clearing cache', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName, function(err, client) {
      assert(err === null);
      assert(client);
      assert(client.testClient === true);

      ariWrapper.clearCache();
      ariWrapper.getClient(config, stasisAppName, function(err, cachedClient) {
        assert(client !== cachedClient);
        assert(err === null);
        assert(client);
        assert(client.testClient === true);

        done();
      });
    });
  });

  it('should support clearing cache entry', function(done) {
    var ariWrapper = require('../lib/wrapper.js');
    var config = {url: 'http://test', username: 'test', password: 'user'};
    var stasisAppName = 'test';

    ariWrapper.getClient(config, stasisAppName, function(err, client) {
      assert(err === null);
      assert(client);
      assert(client.testClient === true);

      ariWrapper.clearCacheEntry(config, stasisAppName);
      ariWrapper.getClient(config, stasisAppName, function(err, cachedClient) {
        assert(client !== cachedClient);
        assert(err === null);
        assert(client);
        assert(client.testClient === true);

        done();
      });
    });
  });
});
