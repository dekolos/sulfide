module.exports = Sulfide => {

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

	return SulfideElement;
};
