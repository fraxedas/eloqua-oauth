# Oauth 2.0 authentication and Oauth 1.0 verification with Eloqua
[![Build Status](https://travis-ci.org/fraxedas/eloqua-oauth.svg)](https://travis-ci.org/fraxedas/eloqua-oauth)
[![NPM](https://nodei.co/npm/eloqua-oauth.png?mini=true)](https://npmjs.org/package/eloqua-oauth)
[![Coverage Status](https://coveralls.io/repos/fraxedas/eloqua-oauth/badge.svg?branch=master&service=github)](https://coveralls.io/github/fraxedas/eloqua-oauth?branch=master)

## Installing the package via npm
```
npm install eloqua-oauth --save
```

## Eloqua configuration
1. Get an eloqua account and create a provider: [Visit AppCloud docs!](http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/AppCloud/appcloud.htm%3FTocPath%3DAppCloud%2520Development%2520Framework%7C_____0)
2. Create an application with the following urls:  
  2.1 Enable Url: https://[app]/oauth/{appId}/{installId}?callback={CallbackUrl}  
  2.2 Status Url: https://[app]/app/status  
  2.3 Callback Url: https://[app]/callback  
3. Copy the app id and the app secret to your application  

>[app] is the domain where you are hosting your application. e.g. https://fraxedas.herokuapp.com  
>The parameters in {} will get replaced in Eloqua before calling your application.  

## [The Oauth 2.0 workflow](http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/GettingStarted/Authentication/authenticate-using-oauth.htm)
Eloqua will call the enable url replacing the values installId, appId and callbackUrl.  
You'll need to get those values from the request uri, persist them and redirect the user to the oauth url.  
```JavaScript
    //Add the library
    var eloqua = require('eloqua-oauth').authentication;
    
    //Get the parameters from the request uri
    var appId = req.params.appId;
    var installId = req.params.installId;
    var callback = req.query.callback;
    
    //Create the authorize uri and redirect the user
    var uri = eloqua.authorize(appId, 'https://[app]/callback', installId);
    res.redirect(uri);
```

Handle the callback from eloqua with the grant token  
```
HTTP/1.1 302 Found
Location: https://[app]/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
```
```JavaScript
    //Get the parameters from the uri
    var installId = req.query.state;
    var code = req.query.code;
    
    //Load appId and client_secret based on the installId of the request
    //The package 'node-persist' will get you up and running fast
    
    //Call the grant endpoint in Eloqua       
    eloqua.grant(appId, client_secret, code, 'https://[app]/callback', function (error, body) {
        if (error) {
            //Handle the error
        }else{
			//Finish the installtion in Eloqua by redirecting to the callback in the previous step
            res.redirect(callback);
        }
    });
```

## [The Oauth 1.0 verification](http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/GettingStarted/Authentication/validating-a-call-signature.htm)
Eloqua will call the application adding the oauth parameters to the url
It is the app's responsibility to ensure the validity of all inbound calls 
```JavaScript
    var verification = require('eloqua-oauth').verification;
    //Get the parameters from the uri
    var valid = verification.verify(uri, method, client_id, client_secret);
```