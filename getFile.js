'use strict';

var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');

logger.debug('begin getFile');

var filesApi = config.filesApi;
var fileId = process.argv[2];
logger.debug('fileId: ', fileId);

if (fileId == null || fileId.trim().length == 0) {
	logger.error('fileId cannot be null or empty.');
	return;	
}

function getFileCallback(err, data) {
	logger.debug('begin getFileCallback');
		
	if (err) {
		console.log(err);
		return;
	}
	
	logger.debug(JSON.parse(data));
	logger.debug('end getFileCallback');
}

function doGetFile(authHeader) {
	logger.debug('begin doGetFile');

	var request = { 
			authorization: authHeader,
			rootUrl: filesApi.rootUrl,
		};

	filesService.getFile(request, fileId, getFileCallback);
	logger.debug('end doGetFile');
}

logger.debug('about to call getAuthHeader');

oauthwrap.getAuthHeader(config.oauthWrapRequest, 
	function(error, authHeader) {
		if (error) {
			logger.warn('error calling oauthWrap.getAuthHeader: ', error);
			return;
		}
		logger.debug('authorization received: ', authHeader);
		doGetFile(authHeader);
});

logger.debug('end getFile');