// filename: getRecords.js

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
}

/**
*	Get all records for a given file.
*	The implementation can be extended to do more than just
*	write to the log/console.
*	@param {string} id The id of the desired file whose records will be retrieved.
*	@param {string} rootUrl The root url of the REST Api.
*/
function getRecords(id, rootUrl) {
	function getRecordsCallback(err, data) {
		logger.debug('begin getRecordsCallback');
			
		if (err) {
			logger.error("error occurred in getRecordsCallback: ", err);
			return;
		}
		
		logger.debug(JSON.parse(data));
	}

	function doGetRecords(authHeader) {
		logger.debug('begin doGetRecords');

		var request = { 
				authorization: authHeader,
				rootUrl: rootUrl,
			};

		filesService.getRecords(request, id, getRecordsCallback);
	}

	oauthwrap.getAuthHeader(config.oauthWrapRequest, 
		function(error, authHeader) {
			if (error) {
				logger.warn('error calling oauthWrap.getAuthHeader: ', error);
				return;
			}
			logger.debug('authorization received: ', authHeader);
			doGetRecords(authHeader);
	})
}

getRecords(fileId, filesApi.rootUrl);

