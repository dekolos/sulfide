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

// Execute the tests
jasmine.execute();
