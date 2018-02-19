// Will be called once before the first spec
global.beforeAll(() => {
	// Increase the timeout of Jasmine to 20 seconds
	// This way Chromium has more than 5 seconds to start up for the first test
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // eslint-disable-line no-magic-numbers
});