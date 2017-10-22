require('ts-node/register');

exports.config = {
    baseUrl: 'http://localhost:3000',

    exclude: [],

    allScriptsTimeout: 5000,
    getPageTimeout: 5000,

    /* CucumberJS: */
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    specs: [
        'test/e2e/**/*.feature'
    ],
    cucumberOpts: {
        require: [
            'test/e2e/**/*.ts'
        ],
        format: 'pretty'
    },

    directConnect: true,

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true']
        }
    },

    onPrepare: function() {
        // check if works again with angular2
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
    },

    // seleniumAddress: 'http://10.100.3.33:4444/wd/hub',
    // seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",

    useAllAngular2AppRoots: true
};
