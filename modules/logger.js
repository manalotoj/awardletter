'use strict';

var winston = require( 'winston' ),
	config = require('../config').logging,
	logDir = config.directory,
	fs = require( 'fs' ),
	env = process.env.NODE_ENV || 'development',
	logger;

winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );

if ( !fs.existsSync( logDir ) ) {
	// Create the directory if it does not exist
	fs.mkdirSync( logDir );
}

logger = new( winston.Logger )( {
	transports: [
		new winston.transports.Console( {
			level: 'silly',
			colorize: true
		} ),
		new winston.transports.File( {
			level: env === 'development' ? 'debug' : 'info',
			filename: logDir + '/al.log',
			maxsize: 1024 * 1024 * 10 // 10MB
		} )
    ],
	exceptionHandlers: [
		new winston.transports.File( {
			filename: '/al_errors.log'
		} )
    ]
} );

module.exports = logger;