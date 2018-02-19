const puppeteer = require('puppeteer');
const {Target} = require('puppeteer/lib/Browser');
const Page = require('puppeteer/lib/Page');

require('./String');

const SulfideElement = require('./SulfideElement')(Sulfide);
const SulfideElementCollection = require('./SulfideElementCollection')(Sulfide, SulfideElement);
const Conditions = require('./Conditions')(Sulfide, SulfideElement, SulfideElementCollection);
const Selectors = require('./Selectors')(Sulfide, SulfideElement);

/**
 * Contains a reference to the opened browser
 * @type {Object}
 */
let browser;

/**
 * The url that will be used when launching the browser
 * Note: This variable will not be updated when opening another page.
 * @type {string}
 */
let launchUrl = '';

/**
 * Will keep references to the pages that are opened. The last one in this array will
 * be the active page (i.e. the page on which actions are performed)
 */
const _pages = [];

/**
 * The options used for NWJS apps. These are the default options of puppeteer
 * without the --disable-extensions options because NWJS runs as an extension.
 * @type {Array}
 */
const NWJS_PUPPETEER_OPTIONS = [
	'--disable-background-networking',
	'--disable-background-timer-throttling',
	'--disable-client-side-phishing-detection',
	'--disable-default-apps',
	//	'--disable-extensions',
	'--disable-hang-monitor',
	'--disable-popup-blocking',
	'--disable-prompt-on-repost',
	'--disable-sync',
	'--disable-translate',
	'--metrics-recording-only',
	'--no-first-run',
	'--safebrowsing-disable-auto-update',
	'--enable-automation',
	'--password-store=basic',
	'--use-mock-keychain',
	'--remote-debugging-port=0',
];

/* eslint-disable no-magic-numbers */
// Default configuration
const DEFAULT_CONFIG = {
	noGlobals: false,
	headless: true,
	ignoreHTTPSErrors: true,
	devtools: false,
	width: 800,
	height: 600,
	disableInfobars: false,
	chromeArgs: [],
	// wait for 4 seconds by default when finding elements
	implicitWaitTime: 4000,
	// Sulfide will poll the page to find elements
	pollInterval: 200,
	// When running Sulfide with Jasmine, assertions can use jasmine assertions to fail tests
	jasmine: false,
	// When testing an app created with NWJS, set this to true
	nwApp: false,
};
/* eslint-enable no-magic-numbers */

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

function $$(selector) {
	if ( selector instanceof SulfideElement ) {
		const collection = new SulfideElementCollection();
		collection.selectors = [].concat(selector.selectors);
		return collection;
	}

	return new SulfideElementCollection(selector);
}

/**
 * Set the configuration that Sulfide will use when launching a browser
 * @param  {Object} config The configuration object
 * @return {Object} The full configuration of Sulfide after adding the new
 * config.
 */
Sulfide.configure = config => {
	// Immutability
	const __config = Object.assign({}, config); // eslint-disable-line no-underscore-dangle

	if ( __config.chromeArgs ) {
		if ( !Array.isArray(__config.chromeArgs) ) {
			throw new Error('chromeArgs should be an array of strings');
		}

		// immutability by using filter
		__config.chromeArgs = __config.chromeArgs.filter(arg => (
			typeof arg === 'string' &&
			arg.trim().indexOf('--no-sandbox') !== 0 &&
			arg.trim().indexOf('--disable-setuid-sandbox') !== 0 &&
			arg.trim().indexOf('--window-size') !== 0 &&
			arg.trim().indexOf('--disable-infobars') !== 0 &&
			arg.trim().indexOf('--app') !== 0
		));
	}

	Sulfide.config = Object.assign({}, DEFAULT_CONFIG);
	for ( const k in config ) {
		if ( __config.hasOwnProperty(k) ) {
			Sulfide.config[k] = __config[k];
		}
	}

	return Sulfide.config;
};

// Set the default configuration
Sulfide.configure({});

/**
 * Can be used to sleep the execution of a async function. Usage:
 *
 * await $.sleep(5000); // Sleep for 5 seconds
 *
 * @param  {number} timeout The sleep time in milliseconds
 * @return {Promise} Resolves after timeout milliseconds
 */
Sulfide.sleep = timeout => new Promise(resolve => {
	setTimeout(() => resolve(), timeout);
});

/**
 * Creates the options object that is used to launch Chromium
 * @return {Object} The options that are used to launch Chromium through Puppeteer
 */
Sulfide.getBrowserLaunchOptions = () => {
	const options = {
		headless: Sulfide.config.headless,
		ignoreHTTPSErrors: Sulfide.config.ignoreHTTPSErrors,
		devtools: Sulfide.config.devtools,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--window-size=' + Sulfide.config.width + ',' + Sulfide.config.height,
			...Sulfide.config.chromeArgs,
		],
	};

	if ( Sulfide.config.disableInfobars ) {
		options.args.push('--disable-infobars');
	}

	if ( Sulfide.config.nwApp ) {
		options.executablePath = launchUrl;

		// Now make sure puppeteer won't disable the extensions because NWJS runs as an extension
		options.ignoreDefaultArgs = true;
		options.args = options.args.concat(NWJS_PUPPETEER_OPTIONS);

		// Make sure we can get Page Promises for Target objects when using NWJS
		overridePuppeteer();
	} else if ( launchUrl ) {
		options.args.push('--app=' + launchUrl);
	}

	return options;
};

/**
 * Opens a browser if necessary and navigates to the given URL.
 * @param  {String} url Url of the page that will be navigated to, or (for NWJS apps)
 * the location (full path) of nw.
 */
Sulfide.open = async url => {
	if ( !browser ) {
		launchUrl = url;
		const options = Sulfide.getBrowserLaunchOptions();
		browser = await puppeteer.launch(options);
	}

	if ( Sulfide.config.nwApp ) {
		return new Promise((resolve, reject) => {
			// For NWJS apps we don't need to navigate to a page as NWJS will take care of that,
			// but we must make sure we keep the references to any pages that are opened as we
			//cannot get them from Puppeteer.
			browser.on('targetchanged', async target => {
				const targetUrl = target.url();
				// _generated_background_page.html is the default page extensions open (NWJS in this case)
				if ( targetUrl.indexOf('_generated_background_page.html') === -1 ) {
					// Only add the page if we don't have it yet
					if ( !_pages.some(p => p.target()._targetId === target._targetId) ) {
						_pages.push(await target.page());
					}
				}
				resolve();
			});

			// Remove a page from our page reference array when closed
			browser.on('targetdestroyed', target => {
				// Don't use filter here to keep the reference to our pages array a constant
				const index = _pages.findIndex(p => p.target()._targetId === target._targetId);
				if ( index === -1 ) {
					// No page found in our array. Weird, shouldn't happen!
					return;
				}
				_pages.splice(index,1 );
			});
		});
	}

	const page = await Sulfide.getPage();
	await page.goto(url, {waitUntil: 'load'});
};

/**
 * Closes the browser
 * @return {Promise} Promise that will be resolved when the browser is closed
 */
Sulfide.close = async () => {
	// Wait a little because we might otherwise close too fast (yeah, it sucks)
	await $.sleep(1500); // eslint-disable-line no-magic-numbers
	await browser.close();
	browser = null;
};

/**
 * Returns the reference to the launched browser or null if
 * no browser exists.
 * @return {Browser} A reference to the browser instance
 */
Sulfide.getBrowser = () => browser;

/**
 * Gets the current page. Will create a new page if there are no pages
 * and the browser has been launched.
 * @return {Promise} Promise will resolve with a reference to the page.
 */
Sulfide.getPage = async () => {
	if ( !browser ) {
		return null;
	}

	let pages = [];
	if ( Sulfide.config.nwApp ) {
		pages = _pages;
	} else {
		pages = await browser.pages();
	}

	if ( pages.length > 0 ) {
		return pages[pages.length - 1];
	}

	const page = await Sulfide.newPage();
	return page;
};

/**
 * Creates a new page when the browser has been launched
 * @return {Promise} Resolves to a reference to the new page,
 * or to null when no browser exists.
 */
Sulfide.newPage = async () => {
	// We won't be creating pages for NWJS apps
	if ( !browser || Sulfide.config.nwApp ) {
		return null;
	}

	const page = await browser.newPage();
	// Add it to our pages references. It will automatically be the active
	// page because it will be the last one in the array.
	_pages.push(page);

	await page.setViewport({
		width: Sulfide.config.width,
		height: Sulfide.config.height,
	});
	return page;
};

/**
 * Returns all the pages opened in the browser.
 * @return {Promise} Will resolve with an array of all opened pages
 */
Sulfide.getPages = async () => {
	if ( !browser ) {
		return [];
	}

	if ( Sulfide.config.nwApp ) {
		return _pages;
	}

	return browser.pages();
};

/**
 * Sets the active page.
 * @param {Page|string} page The page that should be activated. Can be a Page instance or the url
 * of the page that should be activated.
 * @return {Page} The new page or null if the given page is not found.
 */
Sulfide.setPage = page => {
	// We will only use pages that are opened
	const pageOpened = _pages.some((p, i) => {
		if (
			(page instanceof Page && p.target()._targetId === page.target()._targetId) ||
			(typeof page === 'string' && p.url().indexOf(page) > 0 && p.url().indexOf(page) + page.length === p.url().length)
		) {
			// Move the page to the end of our references array, so it will
			// be used as active page
			_pages.splice(i, 1);
			_pages.push(p);
			return true;
		}

		return false;
	});

	if ( !pageOpened ) {
		return null;
	}

	return _pages[_pages.length - 1];
};

/**
 * @alias Sulfide.setPage
 */
Sulfide.switchTo = Sulfide.setPage;

// Add the selectors to Sulfide
for ( const selector in Selectors ) {
	if ( Selectors.hasOwnProperty(selector) ) {
		Sulfide[selector] = Selectors[selector];
	}
}

// Add everything to the global namespace for easy usage
if ( !Sulfide.config.noGlobals ) {
	global.$ = Sulfide;
	global.$$ = $$;

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

/*
 * Overrides the page method of the Target class to make sure that it is possible to get Page instances for NWJS apps.
 */
const overridePuppeteer = () => {
	// This is the crucial part to get page objects for NWJS apps. Puppeteer will only check for type==='page', we will extend the check
	// for NWJS apps.
	Target.prototype.page = function pageSulfideOverride() {
		if ( (this._targetInfo.type === 'page' || (Sulfide.config.nwApp && this._targetInfo.type === 'app' && this._targetInfo.url) ) && !this._pagePromise ) {
			this._pagePromise = this._browser._connection.createSession(this._targetId)
				.then(client => Page.create(client, this, this._browser._ignoreHTTPSErrors, this._browser._appMode, this._browser._screenshotTaskQueue));
		}
		return this._pagePromise;
	};
};