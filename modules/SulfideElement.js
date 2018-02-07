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
			if ( selectorOrXPath.substr(0, 2) === '//' ) {
				this.xpath = selectorOrXPath;
			} else {
				this.selector = selectorOrXPath;
			}

			this.parents = [];
		}

		/**
		 * Finds the child of a SulfideElement. The child can be specified
		 * with a selector, an xpath, or a SulfideElement (created by a
		 * selector function)
		 * @param {string|SulfideElement} selector A css selector, and xpath
		 * or a SulfideElement created by a selector function.
		 * @return {SulfideElement} A SulfideElement that represents the child.
		 */
		find(selector) {
			const element = new SulfideElement('');
			element.parents = [].concat(this.parents);
			element.parents.push(this.selector || this.xpath);
			if ( selector instanceof SulfideElement ) {
				if ( selector.selector ) {
					element.selector = selector.selector;
				} else {
					element.xpath = selector.xpath;
				}
			} else if ( typeof selector === 'string' ) {
				if ( selector.substr(0, 2) === '//' ) {
					element.xpath = selector;
				} else {
					element.selector = selector;
				}
			}

			return element;
		}

		/**
		 * Alias for the find method
		 * @param {string|SulfideElement} selector A css selector, and xpath
		 * or a SulfideElement created by a selector function.
		 * @return {SulfideElement} A SulfideElement that represents the child.
		 */
		$(selector) {
			return this.find(selector);
		}

		//**********************************************************************
		//*                            ASSERTIONS                              *
		//**********************************************************************

		/**
		 * Will check if the given condition has been met within the predefined time
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is met within the predefined time, or to false otherwise
		 */
		async should(condition) {
			return condition.poll(this);
		}

		/**
		 * Alias for the should method
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is met within the predefined time, or to false otherwise
		 */
		async shouldBe(condition) {
			return this.should(condition);
		}

		/**
		 * Alias for the should method
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is met within the predefined time, or to false otherwise
		 */
		async shouldHave(condition) {
			return this.should(condition);
		}

		/**
		 * Will check if the given condition will be 'unmet' within the predefined time, i.e. there should be a moment
		 * when the condition is not met.
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is 'unmet' within the predefined time, or to false otherwise
		 */
		async shouldNot(condition) {
			return condition.poll(this, true);
		}

		/**
		 * Alias for the shouldNot method
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is 'unmet' within the predefined time, or to false otherwise
		 */
		async shouldNotBe(condition) {
			return this.shouldNot(condition);
		}

		/**
		 * Alias for the shouldNot method
		 * @param {Condition} condition The condition that will be checked for the element
		 * @return {Promise} Resolves to tue when the condition is 'unmet' within the predefined time, or to false otherwise
		 */
		async shouldNotHave(condition) {
			return this.shouldNot(condition);
		}

		//**********************************************************************
		//*                             ACTIONS                                *
		//**********************************************************************

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
