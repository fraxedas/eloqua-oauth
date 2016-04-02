/// <reference path="../typings/mocha/mocha.d.ts"/>
describe('Authentication', function() {
    
    var assert = require('assert');
    var authentication = require('../index').authentication;

    var request = {
        post: function(options, next) {
            if (options.fail) {
                next(true);
            }
            else {
                next(false, { statusCode: 302 }, { refresh_token: 1, access_token: 1 });
            }
        }
    };
    authentication.request = request;

    describe('Post request', function() {

        it('should return an error when the request fails', function() {
            authentication.post_request({ fail: true }, function(error, body) {
                assert.ok(error);
            });
        });

        it('should return the response when the request succeeds', function() {
            authentication.post_request({ fail: false }, function(error, body) {
                assert.ok(body);
            });
        });

    });
    
    describe('Grant token', function() {

        it('should return an error when the request fails', function() {
            authentication.grant('client_id', 'client_secret', 'authorization_code', 'https://login.eloqua.com/', function(error, body) {
                assert.ok(body.refresh_token);
                assert.ok(body.access_token);
            });
        });

        it('should return the response when the request succeeds', function() {
            authentication.refresh('client_id', 'client_secret', 'refresh_token', 'https://login.eloqua.com/', function(error, body) {
                assert.ok(body.refresh_token);
                assert.ok(body.access_token);
            });
        });

    });

});