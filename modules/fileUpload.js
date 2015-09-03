// filename: fileUpload.js

/** 
*	@module fileUpload 
*	@description supports a single method to upload file contents via filesService module
*/

'use strict';

var fs = require('fs');
var pathModule = require('path');

var config = require('../config');
var logger = require('./logger');
var oauthwrap = require('./oauthwrap');
var filesService = require('./filesService');

var filesApi = config.filesApi;

/**
*	upload a file as application/octet-stream content
*	@param {string} filePath The file path
*/
module.exports.upload = function(filePath) {
	if (filePath == null || filePath.trim().length == 0) throw new Error('content is null or empty');
	logger.debug('received file to upload: ', filePath);

	var content = '';	

	function uploadCallback(err, data) {
		logger.debug('begin uploadCallback');
			
		if (err) {
			logger.error(err);
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
	}

	/**
	*	Requests security token via oauthwrap module
	*	and invokes doUpload. 
	*/
	function getAuthentication() {
		oauthwrap.getAuthHeader(config.oauthWrapRequest, 
			function(error, authHeader) {
				if (error) {
					logger.warn('error calling oauthWrap.getAuthHeader: ', error);
					return;
				}

				//TODO: add error handling based on http status code
				logger.debug('authorization received: ', authHeader);
				doUpload(content, authHeader);
			});
	}

	/**
	*	handler for fs.readFile that parses the data as json
	*	and subsequently invokes the authentication process.
	*/
	function readFileHandler(err, data) {
		logger.debug('begin readFileHandler');

		if (err) logger.warn("readFileHanlder error: ", err);

		try {
			content = JSON.parse(data);
		} catch (exc) {
			logger.error('JSON.parse failed: ', exc);
			return;
		}
		getAuthentication();
	}

	fs.readFile(filePath, readFileHandler);
}