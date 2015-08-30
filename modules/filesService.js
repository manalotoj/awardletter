'use strict';

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

  //console.log(request.authorization);

  var options = {
    url: request.rootUrl + files,
    headers: {
      'Authorization': request.authorization,
      'Content-Type': 'application/octet-stream'
    },
    body: "{}"
  };  

  function requestHandler(error, response, body){
    if (error) callback(error);
    callback(null, body);
    //console.log('response: ' + response);
    //console.log('body: ' + body);
    
    /*
    if (response.statusCode == 201) { 
      throw new HttpException(response.statusCode, 'Http Status Code 201 not received.'); 
    }
    callback(null, body);
    */
  }

  httpRequest.post(options, requestHandler);
}

exports.getFile = function(request, fileId, callback) {
  throw 'not implemented';
}

exports.getRecords = function(request, fileId, callback) {
  throw 'not implemented';
}


