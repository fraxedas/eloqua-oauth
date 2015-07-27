# Oauth 2.0 authentication
[![Build Status](https://travis-ci.org/fraxedas/eloqua-oauth.svg)](https://travis-ci.org/fraxedas/eloqua-oauth)

# Eloqua configuration
1. Get an eloqua account and create a provider: http://docs.oracle.com/cloud/latest/marketingcs_gs/OMCAB/index.html#Developers/AppCloud/appcloud.htm%3FTocPath%3DAppCloud%2520Development%2520Framework%7C_____0
2. Create an application with the following urls:
* Enable Url: https://[app]/oauth/{appId}/{installId}?callback={CallbackUrl}
* Status Url: https://[app]/app/status
* Callback Url: https://[app]/callback
[app] is the domain where you are hosting your application.
The parameters in {} will get replaced in Eloqua before calling your application.
3. Copy the app id and the app secret to your application

# Installing the package via npm
```
npm install eloqua-oauth --save
```

# The oauth workflow
1. Eloqua will call the enable url
```
var eloqua = require("eloqua-oauth");
oauth.all("/oauth/:appId/:installId", function(req, res){
    var appId = req.params.appId;
    var installId = req.params.installId;
    var callback = req.query.callback;
    
    persist.setItem(installId,
        {
            appId: appId,
            callback: callback
        });                    
    eloquaOauth.authorize({
        client_id: appId,
        redirect_uri: "https://" + req.get('host') + '/callback',
        state: installId //Eloqua will send it back in the callback
    }, function (uri) {
        res.redirect(uri);
    });
});
```

2. Handle the callback
```
oauth.all("/callback", function(req, res){
    var installId = req.query.state;
    var item = persist.getItem(installId);
    var appId = item.appId;
    var callback = item.callback;
    var client_secret = persist.getItem(appId);
    var code = req.query.code;
    
    var authenticate = {
        code: code,
        redirect_uri: "https://" + req.get('host') + '/callback',
        client_id: appId,
        client_secret: client_secret
    };
    eloquaOauth.grant(authenticate, function (error, body) {
        persist.setItem(appId + '_oauth', body);                    
        if (error) {
            //Handle the error
        }else{
			//Finish the installtion in Eloqua
            res.redirect(callback);
        }
    });
});
```