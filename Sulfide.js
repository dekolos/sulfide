const puppeteer = require('puppeteer');

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

const Sulfide = selector => new SulfideElement(selector);

// Default configuration
Sulfide.config = {
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
 * @return {[type]}        [description]
 */
Sulfide.configure = config => {
	for ( k in config ){
		Sulfide.config[k] = config[k];
	}
};

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
				'--no-sandbox',
				'--disable-setuid-sandbox',
			],
		});
	}

	page = await Sulfide.getPage();
	page.on('framenavigated', () => {
		page = Sulfide.getFirstPage();
	});
	page.setViewport({
		width: Sulfide.config.width - 10,
		height: Sulfide.config.height - 10,
	});

	await page.goto(url, {waitUntil: 'load'});
};

// Closes the browser
Sulfide.close = async () => {
	await browser.close();
	browser = null;
	page = null;
}

Sulfide.getFirstPage = async () => {
	const pages = await browser.pages();
	if ( pages ){
		return pages[0];
	} else {
		return await browser.newPage();
	}
};

Sulfide.getPage = async () => {
	if ( !page ) {
		page = await Sulfide.getFirstPage();
	}

	return page;
}

/**
 * Selects an element with the full text given
 * @param  {String} text The entire text of the element that should be selected.
 * @return {SulfideElement} SulfideElement wrapper of the element.
 */
Sulfide.byText = text => {
	const xpath = '//*[text()="' + text + '"]';
	return new SulfideElement(xpath);
};

/**
 * Selects an element that contains the text given
 * @param  {String} text The text that should be part of the text in the element that should be selected.
 * @return {SulfideElement} SulfideElement wrapper of the element.
 */
Sulfide.withText = text => {
	const xpath = '//*[contains(text(), "' + text + '")]';
	return new SulfideElement(xpath);
};


/**
 * Selects an element with the full text given
 * @param  {String} text The entire text of the element that should be selected.
 * @return {SulfideElement} SulfideElement wrapper of the element.
 */
Sulfide.byTextCaseInsensitive = text => {
	const xpath = '//*[translate(text(), "' + text.toUpperCase() + '", "' + text.toLowerCase() + '")="' + text.toLowerCase() + '"]';
	return new SulfideElement(xpath);
};

/**
 * Selects an element that contains the text given
 * @param  {String} text The text that should be part of the text in the element that should be selected.
 * @return {SulfideElement} SulfideElement wrapper of the element.
 */
Sulfide.withTextCaseInsensitive = text => {
	const xpath = '//*//text()[contains(translate(., "' + text.toUpperCase() + '", "' + text.toLowerCase() + '"), "' + text.toLowerCase() + '")]';
	return new SulfideElement(xpath);
};

/**
 * Selects an element with the full text given
 * @param  {String} text The entire text of the element that should be selected.
 * @return {SulfideElement} SulfideElement wrapper of the element.
 */
Sulfide.byValue = value => {
	const xpath = '//*[@value="' + value + '"]';
	return new SulfideElement(xpath);
};




// The page element is a constructor function for HTMLElements inside the page
// The element is found by using a css selector or an XPath.
function SulfideElement(selectorOrXPath) {
	if ( selectorOrXPath.substr(0,2) === '//' ){
		this.xpath = selectorOrXPath;
	} else {
		this.selector = selectorOrXPath;
	}
};

SulfideElement.prototype.exists = async function() {
	let el;
	try {
		if ( this.selector ) {
			el = await (await Sulfide.getFirstPage()).$(this.selector);
		} else if ( this.xpath ){
			el = await (await Sulfide.getFirstPage()).$x(this.xpath);
		}
	} catch (err) {
//		console.log(err)
	}

	return (Array.isArray(el) && el.length > 0) || !!el;
};

// Checks if the pageElement exists inside the page.
// Will poll the page for timeout seconds to find the element.
// If timeout is not given, it will use waitTime.
SulfideElement.prototype.shouldExist = async function(timeout) {
	timeout = timeout || Sulfide.config.implicitWaitTime;

	let el;
	const options = {
		timout: timeout,
	};


	const t0 = new Date().getTime();

	// NOTE: waitForXPath is not defined in v1.0.0 of puppeteer
	// and the timeout doesn't work in waitForSelector
	// so we must implement our own polling function
	const poll = async (resolve, reject) => {
		const found = await this.exists();
		if ( found ){
			resolve(true);
			return true;
		}

		if ( new Date().getTime() - t0 > timeout ){
			resolve(false);
			if ( Sulfide.config.jasmine ) {
				// Make jasmine fail the spec
				fail('Element ' + (this.selector || this.xpath) + ' not found');
			}
			return false;
		} else {
			setTimeout(poll, Sulfide.config.pollInterval, resolve, reject);
			return false;
		}
	};


	return new Promise( (resolve, reject) => {
		poll(resolve, reject);
	});
};

// Focusses the element and uses the keyboard to enter a text.
SulfideElement.prototype.sendKeys = async function(text) {
	await this.shouldExist();
	const page = await Sulfide.getPage();
	await page.focus(this.selector);
	await page.keyboard.type(text);
};

// Focusses the element and uses the keyboard to enter a text followed by ENTER.
SulfideElement.prototype.sendKeysAndEnter = async function(text) {
	await this.sendKeys(text);
	const page = await Sulfide.getPage();
	await page.keyboard.press('Enter');
};


// Clicks the element
SulfideElement.prototype.click = async function() {
	await this.shouldExist();
	const page = await Sulfide.getPage();
	let el;
	if ( this.selector ) {
		el = await page.$(this.selector);
		await el.click();
	} else if ( this.xpath ) {
		el = await page.$x(this.xpath);
		await el[0].click();
	}
};

module.exports = Sulfide;
