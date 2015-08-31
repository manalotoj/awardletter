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

  logger.debug("begin upload; request = " + request);

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
  throw 'not implemented';
}

exports.getRecords = function(request, fileId, callback) {
  throw 'not implemented';
}


