var fs = require('fs');
var pathModule = require('path');

var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');
var fileUpload = require('./modules/fileUpload');
var chokidar = require('chokidar');


var watcher = chokidar.watch('./source', {ignored: /[\/\\]\./, persistent: true});
watcher
    .on('add', function(path) 
    {
        logger.debug('File ', path, ' has been added');    
        if (pathModule.extname(path) === '.' + 'json') {
        	logger.debug('.fiz file has been added - ', path);
        	try {
        		fileUpload.upload(path);
    		} catch (exc) {
    			logger.error(exc);
    		}
        }
    }) 

    .on('error', function(error) {logger.error('chkidar error occurred: ', error);})