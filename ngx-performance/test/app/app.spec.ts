// import { RegressionSlopeValidator } from '@angular/benchpress';

var benchpress = require('@angular/benchpress');
var runner = new benchpress.Runner([
	//use protractor as Webdriver client
	benchpress.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
	//use RegressionSlopeValidator to validate samples
	{provide: benchpress.Validator, useExisting: benchpress.RegressionSlopeValidator},
	//use 10 samples to calculate slope regression
	{provide: benchpress.RegressionSlopeValidator.SAMPLE_SIZE, useValue: 20},
	//use the script metric to calculate slope regression
	{provide: benchpress.RegressionSlopeValidator.METRIC, useValue: 'scriptTime'},
	{provide: benchpress.Options.FORCE_GC, useValue: true}
]);

declare var $: any;
declare var browser: any;

describe('home page load', function() {

	it('should log load time for a 2G connection', done => {

		browser.ignoreSynchronization = true;

		browser.get(`http://localhost:3000`);

		runner.sample({
			id: 'pref-test',
			execute: () => {
				$('p').click();
			},
			userMetrics: {
				timeToBootstrap: 'The time in milliseconds to bootstrap'
			},
			providers: [
				// {provide: benchpress.RegressionSlopeValidator.METRIC, useValue: 'timeToBootstrap'}
			]
		}).then(done, done.fail);
	});

});
