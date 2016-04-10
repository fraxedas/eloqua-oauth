(function(config){
	
    var login = 'https://login.eloqua.com/';
    config.token_url = login + 'auth/oauth2/token'; 
    config.authorize_url  = login + 'auth/oauth2/authorize';
    
})(module.exports);