(function(oauth10) {
    var url = require('url');
    var crypto = require('crypto');

    oauth10.request = function(uri, method) {
        var parsed = url.parse(uri, true);
        parsed.baseUrl = parsed.protocol + '//' + parsed.host + parsed.pathname;
        parsed.method = method.toUpperCase();

        return parsed;
    };

    oauth10.queryfy = function(params) {
        var array = [];
        for (var prop in params) {
            array.push(prop + '=' + params[prop]);
        }
        var encoded = array.sort().join('&');
        return encoded;
    };

    oauth10.base = function(params, request) {
        var encoded = oauth10.queryfy(params);

        var base = oauth10.encode(request.method) + '&' + oauth10.encode(request.baseUrl) + '&' + oauth10.encode(encoded);

        return base;
    };

    oauth10.signingKey = function(clientSecret) {
        var signingKey = oauth10.encode(clientSecret) + '&';

        return signingKey;
    };

    oauth10.signature = function(params, request, client_id, client_secret) {
        var base = oauth10.base(params, request);

        var signingKey = oauth10.signingKey(client_secret);

        var signature = crypto.createHmac('sha1', signingKey).update(base).digest('base64');

        return signature;
    };

    oauth10.encode = function(part) {
        return encodeURIComponent(part).replace(/!/g, '%21');
    };

})(module.exports);