/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * CLI command interface for the code processor
 */

var CodeProcessor = require('..'),
	appc = require('node-appc'),
	i18n = appc.i18n(__dirname),
	__ = i18n.__;

exports.desc = exports.extendedDesc = __('returns JSON formatted information about the Titanium Code Processor plugins');

exports.config = function () {
	var conf = {
		skipBanner: true
	};
	return conf;
};

exports.run = function (logger, config) {
	CodeProcessor.queryPlugins(config.paths && config.paths.codeProcessorPlugins || [], logger, function (err, results) {
		if (err) {
			logger.error(err);
			process.exit(1);
		} else {
			logger.log(JSON.stringify(results, false, '\t'));
		}
	});
};
