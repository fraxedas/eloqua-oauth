/// <reference path="../typings/mocha/mocha.d.ts"/>
var oauth = require('../index');

describe('OAuth 2.0', function(){

    describe('The Request creation', function(){

        it('should parse the url', function(){
          assert.equal(request.hostname, 'api.twitter.com');
          assert.equal(request.query.include_entities, 'true');
          assert.equal(request.method, 'POST');
        });

    });

});