/// <reference path="../typings/mocha/mocha.d.ts"/>
var assert = require('assert');
var verification = require('../index').verification;

describe('Verification', function() {

    describe('given a signed url, the client id and the client secret', function() {

        it('should validate the signature', function() {
            var call = 'https://eloqua-app.herokuapp.com/app/status?oauth_consumer_key=7dd575d1-f923-49ca-87ca-ce0cef09c650&oauth_nonce=6170802&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1460305901&oauth_version=1.0&oauth_signature=g9rdnZp6yz/ipp2mWs4ftNIUdj4=';
            var client_id = '7dd575d1-f923-49ca-87ca-ce0cef09c650';
            var client_secret = '1KzuERrTas06x2Rx58PpALefCXvNrgsO0ZQzDCZeO64hpQC6DblCQpTsNJk4NqJ30VP5RFUUvXA4RSIArmAbvhBf2NvZcr2I3PvV';

            var valid = verification.verify(call, 'Get', client_id, client_secret);
            assert.ok(valid);
        });

    });

});