'use strict';

var logger = require('./logger');
var httpRequest = require('request');
var files = 'files';
var values = 'values';

function HttpException(statusCode, message) {
  this.statusCode = statusCode;
  this.message = message;
  this.toString = function(){
    return 'statusCode: ' + this.statusCode + '; message: ' + this.message;
  }
} 

exports.upload = function(request, callback) {

  logger.debug("begin upload; request = " + JSON.stringify(request));

  var options = {
    url: request.rootUrl + files,
    headers: {
      'Authorization': request.authorization,
      'Content-Type': 'application/octet-stream'
    },
    body: JSON.stringify(request.content)
  };  

  function requestHandler(error, response, body){    
    if (error) {
      logger.error("file upload error: " + error);
      callback(error);
    }
    logger.debug("upload response status code: " + response.statusCode);
    logger.debug("upload response body: " + body);
    callback(null, body);
  }

  httpRequest.post(options, requestHandler);
}

exports.getFile = function(request, fileId, callback) {
  logger.debug('begin getFile; request = ', JSON.stringify(request), '; fileId = ', fileId);

  var options = {
    url: request.rootUrl + files + '/' + fileId,
    headers: {
      'Authorization': request.authorization,
      'Content-Type': 'application/octet-stream'
    }
  };

  function getFileRequestHandler(error, response, body) {
    if (error) {
      logger.error("getFile upload error: " + error);
      callback(error);
    }
    logger.debug("getFile response status code: " + response.statusCode);
    logger.debug("getFile response body: " + body);
    callback(null, body);    
  }

  httpRequest.get(options, getFileRequestHandler);
  logger.debug('end getFile');
}

exports.getRecords = function(request, fileId, callback) {
  logger.debug('begin getFile; request = ', JSON.stringify(request), '; fileId = ', fileId);
  
  var options = {
    url: request.rootUrl + files + '/' + fileId + '/records',
    headers: {
      'Authorization': request.authorization,
      'Content-Type': 'application/octet-stream'
    }
  };

  function getRecordsRequestHandler(error, response, body) {
    if (error) {
      logger.error("getFile upload error: " + error);
      callback(error);
    }
    logger.debug("getFile response status code: " + response.statusCode);
    logger.debug("getFile response body: " + body);
    callback(null, body);    
  }

  httpRequest.get(options, getRecordsRequestHandler);
  logger.debug('end getFile');
}


