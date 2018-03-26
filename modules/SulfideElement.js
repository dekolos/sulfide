module.exports = (Sulfide, Conditions) => (
	/**
	 * A SulfideElement represents a DOM Element by a selector or an xpath.
	 * It can be used to run checks on DOM Element, e.g. if it exists.
	 */
	class SulfideElement {
		/**
		 * Constructor
		 * @param {String} selectorOrXPath A CSS selector or an xpath
		 * @param {String} selectorDescription The description of the selector.
		 * This should be set by selectors when creating a SulfideElement
		 */
		constructor(selectorOrXPath, selectorDescription) {
			this.selectors = [];
			this.selectorDescriptions = [];
			this.elementDescription = '';

			if ( !selectorOrXPath ) {
				return;
			}

			this.selectors.push(selectorOrXPath);

			if ( selectorOrXPath.isXPath() && selectorDescription ) {
				this.selectorDescriptions.push(selectorDescription);
			} else {
				this.selectorDescriptions.push('$(\'' + selectorOrXPath + '\')');
			}
		}

		/**
		 * Tries to find the DOMElement specified by this SulfideElement.
		 * @return {Promise} Resolves to DOMElement (JSHandle) when found, or
		 * to null otherwise.
		 */
		async getDomElement() {
			// Start with the page as base to find the element
			let domElement = await Sulfide.getPage();
			const selectors = [...this.selectors];
			const selectorDescriptions = [...this.selectorDescriptions];
			let selectorDescription = '';
			this.elementDescription = '';

			if ( selectors.length === 0 ) {
				// An element without selectors does not exist
				return null;
			}

			try {
				while ( selectors.length ) {
					const selector = selectors.shift();
					if ( selectorDescription.length > 0 ) {
						selectorDescription += '.';
					}
					selectorDescription += selectorDescriptions.shift();
					if ( selector.isXPath() ) {
						domElement = await domElement.$x(selector); // eslint-disable-line no-await-in-loop
						domElement = domElement.length > 0 ? domElement[0] : null;
					} else {
						domElement = await domElement.$(selector); // eslint-disable-line no-await-in-loop
					}
					this.elementDescription = selectorDescription;
					if ( !domElement ) {
						return null;
					}
				}
			} catch (err) {
				// console.log(err)
			}

			return domElement;
		}

		/**
		 * Finds the child of a SulfideElement. The child can be specified
		 * with a selector, an xpath, or a SulfideElement (created by a
		 * selector function)
		 * @param {string|SulfideElement} selector A css selector, an xpath
		 * or a SulfideElement created by a selector function.
		 * @param {string} The name of the function that was called. This name
		 * will be used in the error message when an assertion fails. (Remember
		 * that there are aliases for this function)
		 * @return {SulfideElement} A SulfideElement that represents the child.
		 */
		find(selector, fnName = 'find') {
			const element = new SulfideElement();
			element.selectors = [].concat(this.selectors);
			element.selectorDescriptions = [].concat(this.selectorDescriptions);
			if ( selector instanceof SulfideElement ) {
				element.selectors = element.selectors.concat(selector.selectors);
				element.selectorDescriptions = element.selectorDescriptions.concat(
					fnName + '(' + selector.selectorDescriptions[0] + ')');
			} else if ( typeof selector === 'string' ) {
				element.selectors.push(selector);
				element.selectorDescriptions.push(fnName + '(\'' + selector + '\')');
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
			return this.find(selector, '$');
		}

		//**********************************************************************
		//*							ASSERTIONS							  *
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
		//*							 ACTIONS								*
		//**********************************************************************

		/**
		 * Will focus the element (if it exists) and type the given text on the keyboard
		 * @param {String} text The text that will be typed
		 * @return {Promise} Will resolve to true when the element exists and the text has been typed, or to false if
		 * the element does not exist
		 */
		async sendKeys(text) {
			await this.shouldExist();
			const element = await this.getDomElement();
			await element.focus();
			const page = await Sulfide.getPage();
			await page.keyboard.type(text);
		}

		// Focusses the element and uses the keyboard to enter a text followed by ENTER.
		/**
		 * [sendKeysAndEnter description]
		 * @param {String} text The text to type in the Element
		 * @return {Promise} Resolves when the text + ENTER has been entered.
		 */
		async sendKeysAndEnter(text) {
			await this.sendKeys(text);
			const page = await Sulfide.getPage();
			await page.keyboard.press('Enter');
		}

		// Clicks the element
		async click() {
			await this.shouldExist();
			const element = await this.getDomElement();
			element.click();
		}

		/**
		 * Sets the value of the element to ''.
		 */
		async clear() {
			await this.shouldExist();
			const element = await this.getDomElement();
			const ec = element.executionContext();
			/* istanbul ignore next */
			await ec.evaluate(el => {
				el.value = '';
			}, element);
		}

		/**
		 * Returns the attribute value of the element
		 * @param {String} attr the attribute which value is requested
		 */
		async getAttribute(attr) {
			await this.shouldExist();
			const element = await this.getDomElement();
			const ec = element.executionContext();
			/* istanbul ignore next */
			const result = await ec.evaluate((el, a) => el.getAttribute(a), element, attr);

			return result;
		}

		/**
		 * Returns the value of the element
		 * @return {Promise} Resolves to the value of the element.
		 */
		async getValue() {
			await this.shouldExist();
			const element = await this.getDomElement();
			const ec = element.executionContext();
			/* istanbul ignore next */
			const value = await ec.evaluate(el => el.value, element);

			return value;
		}
	}
);
