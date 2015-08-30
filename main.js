var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');

var winston = require('winston');
winston.add(winston.transports.File, { filename: 'awardletter.log'});
//winston.info('hello world');

var filesApi = config.filesApi;

function uploadFile(authorization){
	var request = { 
		authorization: authorization,
		rootUrl: filesApi.rootUrl
	};
	//console.log(authorization);
	
	filesService.upload(request, function(err, data) {
		if (err) {
			console.log(err);
			return;
		}
		logger.debug(data);
		console.log(data);
	})
}

oauthwrap.getAuthHeader(config.oauthWrapRequest, 
	function(error, authHeader) {
		if (error) {
			console.log('error: ' + error.toString());
			return;
		}

		//console.log(authHeader);
		uploadFile(authHeader);
	});