module.exports = (Sulfide, Conditions) => (
	/**
	 * A SulfideElement represents a DOM Element by a selector or an xpath.
	 * It can be used to run checks on DOM Element, e.g. if it exists.
	 */
	class SulfideElement {
		/**
		 * Constructor
		 * @param  {String} selectorOrXPath A CSS selector or an xpath
		 */
		constructor(selectorOrXPath) {
			if ( selectorOrXPath.substr(0, 2) === '//' ){
				this.xpath = selectorOrXPath;
			} else {
				this.selector = selectorOrXPath;
			}
		}

		/**
		 * Will check if the given condition has been met within the given time
		 * @param {Condition} condition The condition that will be checked for the element
		 * @param {Number} timeout The maximum time for the condition to be met
		 * @return {Promise} Resolves to tue when the condition is met within the given time, or to false otherwise
		 */
		async should(condition, timeout) {
			return await condition.poll(this, timeout);
		}

		/**
		 * Alternative name for the should method
		 * @param {Condition} condition The condition that will be checked for the element
		 * @param {Number} timeout The maximum time for the condition to be met
		 * @return {Promise} Resolves to tue when the condition is met within the given time, or to false otherwise
		 */
		async shouldBe(condition, timeout) {
			return this.should(condition, timeout);
		}

		/**
		 * Will focus the element (if it exists) and type the given text on the keyboard
		 * @param {String} text The text that will be typed
		 * @return {Promise} Will resolve to true when the element exists and the text has been typed, or to false if
		 * the element does not exist
		 */
		async sendKeys(text) {
			await this.shouldExist();
			const page = await Sulfide.getPage();
			await page.focus(this.selector);
			await page.keyboard.type(text);
		}

		// Focusses the element and uses the keyboard to enter a text followed by ENTER.
		/**
		 * [sendKeysAndEnter description]
		 * @param  {[type]}  text [description]
		 * @return {Promise}      [description]
		 */
		async sendKeysAndEnter(text) {
			await this.sendKeys(text);
			const page = await Sulfide.getPage();
			await page.keyboard.press('Enter');
		}

		// Clicks the element
		async click() {
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
		}
	}
);
