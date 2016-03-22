/// <reference path="../typings/mocha/mocha.d.ts"/>
var rewire = require("rewire");
var authentication = rewire('../lib/authentication');
var assert = require("assert");


describe('OAuth 2.0', function() {

    describe('Post request', function() {

        var request = {
            post: function(options, callback) {
                if (option.fail) {
                    callback(true);
                }
                else {
                    callback(false, { statusCode: 302 }, { refresh_token: 1, access_token: 1 });
                }
            }
        };
        authentication.__set__("request", request);

        it('should return an error when the request fails', function() {
            authentication.post_request({ fail: true }, function(error, response) {
                assert.ok(error);
            });
        });

    });

});