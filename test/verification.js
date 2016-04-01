/// <reference path="../typings/mocha/mocha.d.ts"/>
var assert = require('assert');
var merge = require('merge');
var oauth10 = require('../lib/verification-private');
var verification = require('../index').verification;

var oauth = oauth10.create(
            'xvz1evFS4wEEPTGEFPHBog',
            'HMAC-SHA1',
            '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb',
            '1.0', 
            'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg',
            '1318622958');
var consumerSecret = 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw';
var tokenSecret = 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE';
var uri = 'https://api.twitter.com/1/statuses/update.json?include_entities=true&status=Hello';
var method = 'Post';
var request = oauth10.request(uri, method); 
var params = merge(oauth, request.query);

describe('OAuth 1.0', function(){

    describe('The Request creation', function(){

        it('should parse the url', function(){
          assert.equal(request.hostname, 'api.twitter.com');
          assert.equal(request.query.include_entities, 'true');
          assert.equal(request.method, 'POST');
        });
        
        it('should default to GET for the verb is none is provided', function(){
          var request = oauth10.request('https://habana.io'); 

          assert.equal(request.method, 'GET');
        });

    });

    describe('OAuth 1.0 creation', function(){

        it('should contains all the parameters', function(){
        	assert.equal(oauth.oauth_consumer_key, "xvz1evFS4wEEPTGEFPHBog");
        	assert.equal(oauth.oauth_version, "1.0");
        });
    });

    describe('Encoding the url', function(){

        it('should return the expected value', function(){
        	var result = oauth10.encode("Ladies + Gentlemen!");
        	var expected = "Ladies%20%2B%20Gentlemen%21";
            assert.equal(result, expected);
        });

        it('Should be simetrical', function(){
        	var encoded = oauth10.encode("Ladies + Gentlemen!");
        	var decoded = oauth10.decode(encoded);
          assert.equal("Ladies + Gentlemen!",  decoded);
        });

    });

    describe('OAuth signing', function(){

        it('should encode the parameters', function(){
          var encoded = oauth10.queryfy(params, true);
          assert.equal(encoded, 'include_entities=true&oauth_consumer_key=xvz1evFS4wEEPTGEFPHBog&oauth_nonce=kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1318622958&oauth_token=370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb&oauth_version=1.0&status=Hello');
        });

        it('should encode the parameters for a single object', function(){
          var encoded = oauth10.queryfy(request.query, true);
          assert.equal(encoded, 'include_entities=true&status=Hello');
        });

        it('should compute the base string', function(){
          var base = oauth10.base(params, request, true);
          assert.equal(base, 'POST&https%3A%2F%2Fapi.twitter.com%2F1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello');
        });

        it('should compute the signing key', function(){
          var signingKey = oauth10.signingKey(consumerSecret, tokenSecret);

          assert.equal(signingKey, 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE');
        });

        it('should compute the signature', function(){
          var signature = oauth10.signature(params, request, consumerSecret, tokenSecret);

          assert.equal(signature, 'mMJF6gmS1ycofBcSdA3bvgiwYZU=');
        });

        it('should verify the request', function(){
          var signature = oauth10.signature(params, request, consumerSecret, tokenSecret);
          var signed = oauth10.sign(request, oauth, signature);

          var valid = verification.verify(signed, method, consumerSecret, tokenSecret);
          assert.ok(valid);
        });

    });
});