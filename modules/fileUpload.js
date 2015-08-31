'use strict';

var fs = require('fs');
var pathModule = require('path');

var config = require('../config');
var logger = require('./logger');
var oauthwrap = require('./oauthwrap');
var filesService = require('./filesService');

var filesApi = config.filesApi;

module.exports.upload = function(filePath) {
	if (filePath == null || filePath.trim().length == 0) throw new Error('content is null or empty');
	logger.debug('received file to upload: ', filePath);

	// retrieve file content
	var content = fs.readFileSync(filePath, 'utf8');
	logger.debug("file content: ", content);

	function uploadCallback(err, data) {
		logger.debug('begin uploadCallback');
			
		if (err) {
			console.log(err);
			return;
		}
		
		logger.debug(data);
		logger.debug('end uploadCallback');
	}

	function doUpload(content, authHeader) {
		logger.debug('begin doUpload');

		var request = { 
				authorization: authHeader,
				rootUrl: filesApi.rootUrl,
				content: content
			};

		filesService.upload(request, uploadCallback);
		logger.debug('end doUpload');
	}

	oauthwrap.getAuthHeader(config.oauthWrapRequest, 
		function(error, authHeader) {
			if (error) {
				logger.warn('error calling oauthWrap.getAuthHeader: ', error);
				return;
			}
			logger.debug('authorization received: ', authHeader);
			doUpload(content, authHeader);
		});

	logger.debug('end upload');
}