// filename: fileSystemWatcher.js

'use strict';

var fs = require('fs');
var pathModule = require('path');

var config = require('./config');
var logger = require('./modules/logger');
var oauthwrap = require('./modules/oauthwrap');
var filesService = require('./modules/filesService');
var fileUpload = require('./modules/fileUpload');
var chokidar = require('chokidar');

var watchConfig = config.watch;
logger.debug(watchConfig);
/**
*   Automatically upload files that are created within a designated source directory.
*   @param {object} config Contains values for 1) directory to watch and 2) file extension to watch.
*/
function watch(config) {
    var ext = config.watchedExtension;
    var watcher = chokidar.watch(config.directory, {ignored: /[\/\\]\./, persistent: true});

    watcher
        .on('add', function(path) 
        {
            if (pathModule.extname(path) === '.' + config.extension) {
            	logger.debug('watched file has been added - ', path);
            	try {
            		fileUpload.upload(path);
        		} catch (exc) {
        			logger.error(exc);
        		}
            }
        }) 

        .on('error', function(error) {
            logger.error('chokidar error occurred: ', error);
        })
};

watch(watchConfig);