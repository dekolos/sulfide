const puppeteer = require('puppeteer');

const SulfideElement = require('./SulfideElement')(Sulfide);
const Selectors = require('./Selectors')(Sulfide);

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
 * @param {String} selectorOrXPath CSS selector or and xpath, used to create the SulfideElement
 * @return {SulfideElement} the SulfideElement based on the passed selector or xpath
 */
function Sulfide(selectorOrXPath) {
	return new SulfideElement(selectorOrXPath);
}

// Default configuration
Sulfide.config = {
	noGlobals: false,
	headless: false,
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
/**
 * Set the configuration that Sulfide will use when launching a browser
 * @param  {Object} config The configuration object
 * @return {Object} The full configuration of Sulfide after adding the new
 * config.
 */
Sulfide.configure = config => {
	for ( k in config ){
		Sulfide.config[k] = config[k];
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
				'--window-size=' + Sulfide.config.width + ',' + Sulfide.config.height,
				Sulfide.config.disableInfobars ? '--disable-infobars' : '',
				'--app='+url,
			],
		});
	}

	page = await Sulfide.getPage();
	page.on('framenavigated', () => {
		page = Sulfide.getFirstPage();
	});
	page.setViewport({
		width: Sulfide.config.width,
		height: Sulfide.config.height,
	});

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
}

/**
 * Gets the first open page. Will open a page if none is opened yet
 * @return {Promise} Promise will resolve with a reference to the page .
 */
Sulfide.getFirstPage = async () => {
	const pages = await browser.pages();
	if ( pages ){
		return pages[0];
	} else {
		return await browser.newPage();
	}
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
}

// Add the selectors
for ( selector in Selectors ) {
	Sulfide[selector] = Selectors[selector]
};

if ( !Sulfide.config.noGlobals ) {
	global.$ = Sulfide;
}

module.exports = Sulfide;
