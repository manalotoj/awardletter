'use strict';

var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');

logger.debug('begin getRecords');

var filesApi = config.filesApi;
var fileId = process.argv[2];
logger.debug('fileId: ', fileId);

if (fileId == null || fileId.trim().length == 0) {
	logger.error('fileId cannot be null or empty.');
	return;	
}

function getRecordsCallback(err, data) {
	logger.debug('begin getRecordsCallback');
		
	if (err) {
		console.log(err);
		return;
	}
	
	logger.debug(JSON.parse(data));
	logger.debug('end getRecordsCallback');
}

function doGetRecords(authHeader) {
	logger.debug('begin doGetRecords');

	var request = { 
			authorization: authHeader,
			rootUrl: filesApi.rootUrl,
		};

	filesService.getRecords(request, fileId, getRecordsCallback);
	logger.debug('end doGetRecords');
}

logger.debug('about to call getAuthHeader');

oauthwrap.getAuthHeader(config.oauthWrapRequest, 
	function(error, authHeader) {
		if (error) {
			logger.warn('error calling oauthWrap.getAuthHeader: ', error);
			return;
		}
		logger.debug('authorization received: ', authHeader);
		doGetRecords(authHeader);
});

logger.debug('end getRecords');