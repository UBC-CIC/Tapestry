/** 
 * The following is the AWS Lambda function which is used as a Lambda Authorizer to deny API access to users
 * not using the Tapestry plugin
*/
 
exports.handler = async (event) => {
    if(event.headers.authorization == process.env['SECURITY_KEY'])
        return {
            "isAuthorized": true,
            "context": {
                "AuthInfo": "PluginUser"
            }
        };
    else 
        return {
            "isAuthorized": false,
            "context": {
                "AuthInfo": "NotPluginUser"
            }
        };
};