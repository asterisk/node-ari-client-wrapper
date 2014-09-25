/**
 *  ARI client wrapper unit tests.
 *
 *  @module tests-context
 *  @copyright 2014, Digium, Inc.
 *  @license Apache License, Version 2.0
 *  @author Samuel Fortier-Galarneau <sgalarneau@digium.com>
 */

'use strict';

/*global describe:false*/
/*global beforeEach:false*/
/*global it:false*/

var assert = require('assert');
var ariWrapper = require('../lib/wrapper.js');

describe('wrapper', function() {
  it('should cache clients', function(done) {
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
