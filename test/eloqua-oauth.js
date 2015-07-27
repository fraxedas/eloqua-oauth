/// <reference path="../typings/mocha/mocha.d.ts"/>
var oauth = require('../index');

describe('OAuth 2.0', function(){

    describe('Authorization header', function(){

        it('should be bearer', function(){
            var header = oauth.access_access_header('token');
            assert.equal(header.Authorization,  'Bearer token');
        });

    });

});