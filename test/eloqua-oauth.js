/// <reference path="../typings/mocha/mocha.d.ts"/>
var oauth = require('../index');
var assert = require("assert");

describe('OAuth 2.0', function(){

    describe('Authorization header', function(){

        it('should be bearer', function(){
            var header = oauth.access_header('token');
            assert.equal(header.Authorization,  'Bearer token');
        });

    });

});