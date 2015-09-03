// filename: getFile.js

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
}

/**
*	Get file processing results summary for a given file.
*	The implementation can be extended to do more than just
*	write to the log/console.
*	@param {string} id The id of the desired file.
*	@param {string} rootUrl The root url of the REST Api.
*/
function getFile(id, rootUrl) {
	logger.debug('begin getFile');

	function getFileCallback(err, data) {
		logger.debug('begin getFileCallback');
			
		if (err) {
			logger.error("error occurred in getFileCallback: ", err);
			return;
		}
		
		logger.debug(JSON.parse(data));
	}

	/**
	*	Retrieve file processing results via filesService module.
	*	@param {string} authHeader OAuth WRAP security token formatted
	*		as an HTTP request header value.
	*/
	function doGetFile(authHeader) {
		logger.debug('begin doGetFile');

		var request = { 
				authorization: authHeader,
				rootUrl: rootUrl,
			};

		filesService.getFile(request, id, getFileCallback);
		logger.debug('end doGetFile');
	}

	oauthwrap.getAuthHeader(config.oauthWrapRequest, 
		function(error, authHeader) {
			if (error) {
				logger.warn('error calling oauthWrap.getAuthHeader: ', error);
				return;
			}
			logger.debug('authorization received: ', authHeader);
			doGetFile(authHeader);
	});
};

getFile(fileId, filesApi.rootUrl);