const puppeteer = require('puppeteer');

require('./String');

const SulfideElement = require('./SulfideElement')(Sulfide);
const Conditions = require('./Conditions')(Sulfide, SulfideElement);
const Selectors = require('./Selectors')(Sulfide, SulfideElement);

/**
 * Contains a reference to the opened browser
 * @type {Object}
 */
let browser;

/**
 * Contains a reference to the active page
 * @type {Object}
 */
let page;

/**
 * Main function of Sulfide. Acts as an SulfideElement creator.
 * @param {String|SulfideElement} selector CSS selector or xpath, used to create the SulfideElement, or a SulfideElement
 * @return {SulfideElement} the SulfideElement based on the passed selector or xpath
 */
function Sulfide(selector) {
	if ( selector instanceof SulfideElement ) {
		return selector;
	}

	return new SulfideElement(selector);
}

/* eslint-disable no-magic-numbers */
// Default configuration
Sulfide.config = {
	noGlobals: false,
	headless: true,
	ignoreHTTPSErrors: true,
	devtools: false,
	width: 800,
	height: 600,
	disableInfobars: false,
	// wait for 4 seconds by default when finding elements
	implicitWaitTime: 4000,
	// Sulfide will poll the page to find elements
	pollInterval: 200,
	// When running Sulfide with Jasmine, assertions can use jasmine assertions to fail tests
	jasmine: false,
};
/* eslint-enable no-magic-numbers */

/**
 * Set the configuration that Sulfide will use when launching a browser
 * @param  {Object} config The configuration object
 * @return {Object} The full configuration of Sulfide after adding the new
 * config.
 */
Sulfide.configure = config => {
	for ( const k in config ) {
		if ( config.hasOwnProperty(k) ) {
			Sulfide.config[k] = config[k];
		}
	}

	return Sulfide.config;
};

Sulfide.sleep = timeout => new Promise(resolve => {
	setTimeout(() => resolve(), timeout);
});

/**
 * Opens a browser if necessary and navigates to the given URL.
 * @param  {String} url Url of the page that will be tested.
 */
Sulfide.open = async url => {
	if ( !browser ) {
		browser = await puppeteer.launch({
			headless: Sulfide.config.headless,
			ignoreHTTPSErrors: Sulfide.config.ignoreHTTPSErrors,
			devtools: Sulfide.config.devtools,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--window-size=' + Sulfide.config.width + ',' + Sulfide.config.height,
				Sulfide.config.disableInfobars ? '--disable-infobars' : '',
				'--app=' + url,
			],
		});
	}

	if ( !page ) {
		page = await Sulfide.getPage();
		page.on('framenavigated', async () => {
			page = await Sulfide.getFirstPage();
		});
		await page.setViewport({
			width: Sulfide.config.width,
			height: Sulfide.config.height,
		});
	}

	await page.goto(url, {waitUntil: 'load'});
};

/**
 * Closes the browser
 * @return {Promise} Promise that will be resolved when the browser is closed
 */
Sulfide.close = async () => {
	await browser.close();
	browser = null;
	page = null;
};

/**
 * Gets the first open page. Will open a page if none is opened yet
 * @return {Promise} Promise will resolve with a reference to the page .
 */
Sulfide.getFirstPage = async () => {
	const pages = await browser.pages();
	if ( pages ) {
		return pages[0];
	}

	return browser.newPage();
};

/**
 * Gets the current page, or the first if none is active yet.
 * @return {Promise} Promise will resolve with a reference to the page.
 */
Sulfide.getPage = async () => {
	if ( !page ) {
		page = await Sulfide.getFirstPage();
	}

	return page;
};

// Add the selectors to Sulfide
for ( const selector in Selectors ) {
	if ( Selectors.hasOwnProperty(selector) ) {
		Sulfide[selector] = Selectors[selector];
	}
}

// Add everything to the global namespace for easy usage
if ( !Sulfide.config.noGlobals ) {
	global.$ = Sulfide;

	// Add the selectors
	for ( const selector in Selectors ) {
		if ( Selectors.hasOwnProperty(selector) ) {
			global[selector] = Selectors[selector];
		}
	}

	// Add the conditions
	for ( const condition in Conditions ) {
		if ( Conditions.hasOwnProperty(condition) ) {
			global[condition] = Conditions[condition];
		}
	}
}

module.exports = Sulfide;
