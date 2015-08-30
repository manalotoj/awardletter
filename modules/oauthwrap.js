module.exports.getAuthHeader = function(request, callback) {
	// call sts
	var https = require('https');
	var constants = require('constants');
	var httpRequest = require('request');

	var form = {'wrap_name': request.creds.uid, 
		'wrap_password': request.creds.pwd, 
		'wrap_scope': request.wrapScope};

	responseHandler = function(err, response, body) {
		if (err) { callback(err); return; }

		// extract and format token
		var output = body.split('&')[0];
		var start = 'wrap_access_token=';
		//output = output.substring(start.length, output.length).replace(/[\xFF-\xFFFF]/g, "%" + "$&".charCodeAt(0));
		//output = output.substring(start.length, output.length);
		//console.log(output);
		output = 'WRAP access_token="' + unescape(output.substring(start.length, output.length)) + '"';

		// build header

		// return value
		callback(null, output);
	};

	httpRequest.post({url: request.url, form: form}, responseHandler);
}