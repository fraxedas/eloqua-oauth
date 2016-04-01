(function(oauth10) {
    var url = require('url');
    var uuid = require('node-uuid');
    var crypto = require('crypto');
    var merge = require('merge');

    oauth10.request = function(uri, method) {
        if (typeof method === 'undefined') {
            method = "GET";
        }

        var parsed = url.parse(uri, true);
        parsed.baseUrl = parsed.protocol + '//' + parsed.host + parsed.pathname;
        parsed.method = method.toUpperCase();

        return parsed;
    };

    oauth10.queryfy = function(params, encode) {
        var array = [];
        for (var prop in params) {
            if (encode) {
                array.push(oauth10.encode(prop) + '=' + oauth10.encode(params[prop]));
            }
            else {
                array.push(prop + '=' + params[prop]);
            }
        }
        var encoded = array.sort().join('&');
        return encoded;
    };

    oauth10.base = function(params, request, encode) {
        var encoded = oauth10.queryfy(params, encode);

        var base = oauth10.encode(request.method) + '&' + oauth10.encode(request.baseUrl) + '&' + oauth10.encode(encoded);

        return base;
    };

    oauth10.signingKey = function(consumerSecret, tokenSecret) {
        var signingKey = oauth10.encode(consumerSecret) + '&' + oauth10.encode(tokenSecret);

        return signingKey;
    };

    oauth10.signature = function(params, request, consumerSecret, tokenSecret, encode) {
        if (typeof encode === 'undefined') {
            encode = true;
        }

        var base = oauth10.base(params, request, encode);

        var signingKey = oauth10.signingKey(consumerSecret, tokenSecret);

        var signature = crypto.createHmac('sha1', signingKey).update(base).digest('base64');

        return signature;
    };

    oauth10.sign = function(request, params, signature) {
        var merged = merge(params, { oauth_signature: signature });
        return request.baseUrl + '?' + oauth10.queryfy(merged);
    };

    oauth10.verify = function(request, consumerSecret, tokenSecret) {
        var signature = request.query.oauth_signature;
        delete request.query.oauth_signature;
        var generated = oauth10.signature(request.query, request, consumerSecret, tokenSecret);

        return generated === signature;
    };

    oauth10.create = function(
        oauth_consumer_key,
        oauth_signature_method,
        oauth_token,
        oauth_version,
        oauth_nonce,
        oauth_timestamp) {

        if (typeof oauth_nonce === 'undefined') {
            oauth_nonce = oauth10.nounce();
        }
        if (typeof oauth_timestamp === 'undefined') {
            oauth_timestamp = oauth10.timestamp;
        }

        var oauth = {
            oauth_consumer_key: oauth_consumer_key,
            oauth_signature_method: oauth_signature_method,
            oauth_token: oauth_token,
            oauth_version: oauth_version,
            oauth_nonce: oauth_nonce,
            oauth_timestamp: oauth_timestamp
        };
        return oauth;
    };

    oauth10.nounce = function() {
        return uuid.v1();
    };

    oauth10.timestamp = function() {
        return new Date().getTime() / 1000;
    };

    oauth10.encode = function(part) {
        return encodeURIComponent(part).replace(/!/g, '%21');
    };

    oauth10.decode = function(part) {
        return decodeURIComponent(part);
    };

})(module.exports);