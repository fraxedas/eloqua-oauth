///Implements the Eloqua oauth varification described at:
///http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/GettingStarted/Authentication/validating-a-call-signature.htm

(function(oauth){
	var verification = require('./verification-private');

	oauth.verify = function (uri, mehod, client_id, client_secret){
		var request = verification.request(uri, mehod);
		var signature = request.query.oauth_signature;
		delete request.query.oauth_signature;
		var generated = verification.signature(request.query, request, client_id, client_secret);
		
		return client_id === request.query.oauth_consumer_key && generated === signature;
	};
	
})(module.exports);