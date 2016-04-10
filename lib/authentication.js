/* global Buffer */
///Implements the Eloqua oauth flow described at:
///http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/GettingStarted/Authentication/authenticate-using-oauth.htm

(function(oauth){
	var qs = require('querystring');
    var request = require('request');
    var config = require('./authentication-config');
    
    oauth.request = request;
    
    oauth.access_header  = function(access_token) {
        return {'Authorization': 'Bearer ' + access_token};
    };
        
    oauth.authorize_uri  = function(client_id, redirect_uri, install_id) {
        var parameters = qs.stringify({
            client_id: client_id,
            redirect_uri: redirect_uri,
            state: install_id,
            response_type: 'code',
            scope: 'full'
            });
        return config.authorize_url + '?' + parameters;
    };
    
    oauth.grant  = function(client_id, client_secret, authorization_code, redirect_uri, next) {
        var options = oauth.grant_request_options(client_id, client_secret, authorization_code, redirect_uri);
        oauth.post_request(options, next);
    };
    
    oauth.refresh  = function(client_id, client_secret, refresh_token, redirect_uri, next) {
        var options = oauth.refresh_request_options(client_id, client_secret, refresh_token, redirect_uri);
        oauth.post_request(options, next);
    };
    
    oauth.grant_request_options  = function(client_id, client_secret, authorization_code, redirect_uri) {
        var body = {
            grant_type: 'authorization_code',
            code: authorization_code,
            redirect_uri: redirect_uri
            };
        return get_options(client_id, client_secret, body);
    };
    
    oauth.refresh_request_options  = function(client_id, client_secret, refresh_token, redirect_uri) {
        var body = {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            scope: 'full',
            redirect_uri: redirect_uri
            };
        return get_options(client_id, client_secret, body);
    };
    
    var get_options  = function(client_id, client_secret, body) {
        var credentials = new Buffer(client_id + ':' + client_secret).toString('base64');
        var options = {
          url: config.token_url,
          headers: {
            'Authorization': 'Basic ' + credentials
          },
          json: body
        };
        return options;
    };
    
    oauth.post_request = function(options, next){
         oauth.request.post(options, function (error, response, body) {
            if (!error && response.statusCode < 400 && body.refresh_token && body.access_token) {
                next(null, body);
            }else{
                next(error, null);
            }
        });
    };
    
})(module.exports);