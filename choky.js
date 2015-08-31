var fs = require('fs');
var pathMod = require('path');

var config = require('./config');
var logger = require('./modules/logger');
var chokidar = require('chokidar');

//logger.debug('here we go');

chokidar = require('chokidar');

var watcher = chokidar.watch('./source', {ignored: /[\/\\]\./, persistent: true});
watcher
    .on('add', function(path) 
    {
        logger.debug('File ', path, ' has been added');    
    })

    .on('error', function(error) {logger.error('Error happened', error);})

/*
chokidar.watch('./source', {ignored: /[\/\\]\./}).on('all', function(event, path) {
	logger.debug(event, path);
	console.log(event, path);
});
*/

/*
var watcher = chokidar.watch('file', {
  ignored: /[\/\\]\./,
  persistent: true
});

console.log('set watch on file');

watcher
  .on('add', function(path) { 
  	logger.debug('watcher detected add', path);
  	console.log('file has been added'); 
  })
  .on('error', function(error) { 
  	console.log('error happend', error); 
  	logger.error('error happened', error);
  }); */