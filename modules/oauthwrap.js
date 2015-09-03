//	filename: oauthwrap.js

/** 
* @module oauthwrap 
* @description Supports function to retrieve OAuth WRAP security tokens from an STS.
*/

'use strict';

var logger = require('./logger');

/**
*	Get an OAuth WRAP header value from an STS.
*	@param {object} request Contains values for 1) STS url, 2) user credentials, and 3) request scope.
*	@param {function} callback Data will contain authorization token formatted as required for
*		an http request header.
*/
module.exports.getAuthHeader = function(request, callback) {
	logger.debug('begin getAuthHeader');

	// call STS
	var constants = require('constants');
	var httpRequest = require('request');

	var form = {'wrap_name': request.creds.uid, 
		'wrap_password': request.creds.pwd, 
		'wrap_scope': request.wrapScope};

	/**
	* callback for http.post
	* @param {Exception} error The error if any  
	* @param {object} response http response object
	* @param {body} body http response body
	*/ 	
	function responseHandler(err, response, body) {
		if (err) { callback(err); return; }

		//	todo: handle unexpected http status codes

		// extract and format token
		var output = body.split('&')[0];
		var start = 'wrap_access_token=';
		output = 'WRAP access_token="' + unescape(output.substring(start.length, output.length)) + '"';
		callback(null, output);
	};

	httpRequest.post({url: request.url, form: form}, responseHandler);
}