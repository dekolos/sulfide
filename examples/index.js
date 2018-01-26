const Jasmine = require('jasmine');

const specsDir = __dirname.substr(process.cwd().length + 1) + '/specs';

const jasmine = new Jasmine();
jasmine.loadConfig({
	spec_dir: specsDir,
	spec_files: [
		'**/*.js',
	],
	stopSpecOnExpectationFailure: true,
});

jasmine.execute();
