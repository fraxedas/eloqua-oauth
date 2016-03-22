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

});