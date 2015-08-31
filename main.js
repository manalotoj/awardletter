var fs = require('fs');
var pathModule = require('path');

var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');
var chokidar = require('chokidar');

var filesApi = config.filesApi;

function upload(filePath) {
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
			doUpload(filePath, authHeader);
		});

	logger.debug('end uploadFile');
}

var watcher = chokidar.watch('./source', {ignored: /[\/\\]\./, persistent: true});
watcher
    .on('add', function(path) 
    {
        logger.debug('File ', path, ' has been added');    
        if (pathModule.extname(path) === '.' + 'fiz') {
        	logger.debug('.fiz file has been added - ', path);
        	try {
        		upload(path);
    		} catch (exc) {
    			logger.error(exc);
    		}
        }
    })

    .on('error', function(error) {logger.error('chkidar error occurred: ', error);})