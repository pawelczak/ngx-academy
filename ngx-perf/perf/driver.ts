import {Builder, WebDriver, promise, logging} from 'selenium-webdriver'
import * as chrome from 'selenium-webdriver/chrome'

const lighthouse = require('lighthouse');

function buildDriver() {
	let logPref = new logging.Preferences();
	logPref.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
	logPref.setLevel(logging.Type.BROWSER, logging.Level.ALL);

	let options = new chrome.Options();
	if(args.headless) {
		options = options.addArguments("--headless");
		options = options.addArguments("--disable-gpu");
	}
	options = options.addArguments("--js-flags=--expose-gc");
	options = options.addArguments("--no-sandbox");
	options = options.addArguments("--no-first-run");
	options = options.addArguments("--enable-automation");
	options = options.addArguments("--disable-infobars");
	options = options.addArguments("--disable-background-networking");
	options = options.addArguments("--disable-background-timer-throttling");
	options = options.addArguments("--disable-cache");
	options = options.addArguments("--disable-translate");
	options = options.addArguments("--disable-sync");
	options = options.addArguments("--disable-extensions");
	options = options.addArguments("--disable-default-apps");
	options = options.addArguments("--window-size=1200,800");
	if (args.chromeBinary) options = options.setChromeBinaryPath(args.chromeBinary);
	options = options.setLoggingPrefs(logPref);

	options = options.setPerfLoggingPrefs(<any>{
		enableNetwork: true, enablePage: true, enableTimeline: false,
		traceCategories: lighthouse.traceCategories.join(", ")
	});

	// Do the following lines really cause https://github.com/krausest/js-framework-benchmark/issues/303 ?
	// let service = new chrome.ServiceBuilder(args.chromeDriver).build();
	// return chrome.Driver.createSession(options, service);
	return new Builder()
		.forBrowser('chrome')
		.setChromeOptions(options)
		.build();
}

let driver = buildDriver();

async function runStartupBenchmark(driver) {
	try {
		// setUseShadowRoot(framework.useShadowRoot);
		// await driver.executeScript("console.timeStamp('initBenchmark')");
		// await initBenchmark(driver, benchmark, framework);
		// await driver.executeScript("console.timeStamp('runBenchmark')");
		// await runBenchmark(driver, benchmark, framework);
		// await driver.executeScript("console.timeStamp('finishedBenchmark')");
		// await afterBenchmark(driver, benchmark, framework);
		await driver.executeScript("console.timeStamp('afterBenchmark')");
		await wait(5000);
		// results.push(await computeResultsStartup(driver));
	} catch (e) {
		// await registerError(driver, framework, benchmark, e);
		throw e;
	} finally {
		await driver.quit();
	}
}