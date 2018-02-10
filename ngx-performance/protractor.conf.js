require('ts-node/register');

exports.config = {

	framework: 'jasmine2',
	specs: [
		'test/**/*.spec.ts'
	],

	directConnect: true,

	capabilities: {
		browserName: 'chrome',
		chromeOptions: {
			//Important for benchpress to get timeline data from the browser
			'args': ['--js-flags=--expose-gc'],
			'perfLoggingPrefs': {
				'traceCategories': 'v8,blink.console,devtools.timeline'
			}
		},
		loggingPrefs: {
			performance: 'ALL'
		}
	},


	onPrepare: function () {
		beforeEach(function() {
			browser.ignoreSynchronization = false;
		});
	},

	// restart browser between tests
	// so that the browser does not keep
	// optimizations
	restartBrowserBetweenTests: true,

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};
