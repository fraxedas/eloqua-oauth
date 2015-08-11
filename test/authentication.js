/// <reference path="../typings/mocha/mocha.d.ts"/>
var authentication = require('../index').authentication;
var assert = require("assert");

String.prototype.contains = function(other){
    return this.indexOf(other) > -1;
};

describe('OAuth 2.0', function(){

    describe('Access header', function(){

        var header = authentication.access_header('token');
        
        it('should contain authorization', function(){
            assert.ok(header.Authorization);
        });
        
        it('should be bearer', function(){
            assert.ok(header.Authorization.contains('Bearer'));
        });
        
         it('should contain the token', function(){
            assert.ok(header.Authorization.contains('token'));
        });
        
        it('should be Bearer token', function(){
            assert.equal(header.Authorization, 'Bearer token');
        });

    });
    
    describe('Generate oauth authorize uri', function(){
        
        var uri = authentication.authorize_uri('client_id', 'redirect_uri', 'install_id');
            
        it('should contain all parameters', function(){
            assert.ok(uri.contains('=client_id'));
            assert.ok(uri.contains('=redirect_uri'));
            assert.ok(uri.contains('=install_id'));
        });
    });
    
    describe('Grant options', function(){

        var options = authentication.grant_request_options('client_id', 'client_secret', 'authorization_code', 'redirect_uri');
         
        describe('headers', function(){

            var headers = options.headers;
            
            it('should contain authorization', function(){
                assert.ok(headers.Authorization);
            });
            
            it('should be basic', function(){
                assert.ok(headers.Authorization.contains('Basic'));
            });
            
        });
        
        describe('url', function(){

            var url = options.url;
            
            it('should not be null', function(){
                assert.ok(url);
            });
            
            it('should be oauth', function(){
                assert.ok(url.contains('oauth'));
            });
            
        });
        
        describe('body', function(){

            var json = options.json;
            console.log(json);
            
            it('should be json', function(){
                assert.ok(json);
            });
            
            it('should be have the proper values', function(){
                assert.equal(json.grant_type, 'authorization_code');
                assert.equal(json.code, 'authorization_code');
                assert.equal(json.redirect_uri, 'redirect_uri');
            });
            
        });
    });
    
    describe('Refresh options', function(){

        var options = authentication.refresh_request_options('client_id', 'client_secret', 'refresh_token', 'redirect_uri');
         
        describe('headers', function(){

            var headers = options.headers;
            
            it('should contain authorization', function(){
                assert.ok(headers.Authorization);
            });
            
            it('should be basic', function(){
                assert.ok(headers.Authorization.contains('Basic'));
            });
            
        });
        
        describe('url', function(){

            var url = options.url;
            
            it('should not be null', function(){
                assert.ok(url);
            });
            
            it('should be oauth', function(){
                assert.ok(url.contains('oauth'));
            });
            
        });
        
        describe('body', function(){

            var json = options.json;
            console.log(json);
            
            it('should be json', function(){
                assert.ok(json);
            });
            
            it('should be have the proper values', function(){
                assert.equal(json.grant_type, 'refresh_token');
                assert.equal(json.refresh_token, 'refresh_token');
                assert.equal(json.scope, 'full');
                assert.equal(json.redirect_uri, 'redirect_uri');
            });
            
        });
    });

});