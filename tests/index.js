const Jasmine = require('jasmine');

const specsDir = __dirname.substr(process.cwd().length + 1) + '/specs';

const jasmine = new Jasmine();
jasmine.loadConfig({
	spec_dir: specsDir,
	spec_files: [
		'**/*.js',
	],
	stopSpecOnExpectationFailure: false,
});

// setup console reporter
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});
jasmine.env.clearReporters();
jasmine.addReporter(reporter);

const Sulfide = require('../modules/Sulfide');
// Some configurations for Sulfide
Sulfide.configure({
	jasmine: true,
	implicitWaitTime: 500,
	width: 1200,
	height: 800,
	disableInfobars: false,
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // 20 seconds

// Execute the tests
jasmine.execute();
