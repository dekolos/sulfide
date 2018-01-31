module.exports = (Sulfide, SulfideElement) => {
	/**
	 * Base class for conditions.
	 */
	class Condition {
		constructor(timeout) {
			this.timeout = timeout || Sulfide.config.implicitWaitTime;
		}

		/**
		 * Main function of the condition. Will return true or false to
		 * denote that the condition is met or not for the given SulfideElement.
		 * Conditions should extend this class and implement this function.
		 *
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {Boolean} True if the condition is met for the given element, false otherwise.
		 */
		async test(element) {
			return false;
		}

		getFailureMessage(element) {
			return 'Condition not met'
		}

		async poll(element, negate) {
			negate = !!negate;
			const options = {
				timout: this.timeout,
			};

			const t0 = new Date().getTime();

			// NOTE: waitForXPath is not defined in v1.0.0 of puppeteer
			// and also the timeout doesn't work in waitForSelector
			// so we must implement our own polling function
			const poll = async (resolve, reject) => {
				const conditionMet = await this.test(element);
				if ( (conditionMet && !negate) || !conditionMet && negate ){
					resolve(true);
					return true;
				}

				if ( new Date().getTime() - t0 > this.timeout ){
					resolve(false);
					if ( Sulfide.config.jasmine ) {
						// Make jasmine fail the spec
						fail(this.getFailureMessage(element, negate));
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
		}

	}

	/**
	 * Condition to test if an element exists on the page.
	 */
	class ExistCondition extends Condition {
		/**
		 * Returns the message that will be passed to Jasmine when the condition is not met.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {String} The failure message for this condition
		 */
		getFailureMessage(element, negate) {
			if ( negate ){
				return 'Element ' + (element.selector || element.xpath) + ' is found';
			}

			return 'Element ' + (element.selector || element.xpath) + ' not found';
		}

		/**
		 * Tests if the given SulfideElement exists
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {Promise} Resolves with true when the condition is met before the timout, false otherwise
		 */
		async test(element) {
			let domElement;
			try {
				if ( element.selector ) {
					domElement = await (await Sulfide.getFirstPage()).$(element.selector);
				} else if ( element.xpath ){
					domElement = await (await Sulfide.getFirstPage()).$x(element.xpath);
				}
			} catch (err) {
		//		console.log(err)
			}

			return Array.isArray(domElement) ? domElement.length > 0 : !!domElement;
		}
	}

	// Factory function to create ExistConditions
	const exist = timeout => new ExistCondition(timeout);

	// Add shortcut functions to the SulfideElement class
	SulfideElement.prototype.shouldExist = async function(timeout) {
		return this.should(exist(timeout));
	};
	SulfideElement.prototype.shouldNotExist = async function(timeout) {
		return this.shouldNot(exist(timeout));
	};

	/**
	 * Condition to test if an element exists on the page.
	 */
	class VisibleCondition extends Condition {
		constructor() {
			super();
			this.elementExists = false;
		}

		/**
		 * Returns the message that will be passed to Jasmine when the condition is not met.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {String} The failure message for this condition
		 */
		getFailureMessage(element) {
			if ( negate ){
				return 'Element ' + (element.selector || element.xpath) + ' is visible';
			}

			if ( !this.elementExists ){
				return 'Element ' + (element.selector || element.xpath) + ' not found, so not visible';
			}

			return 'Element ' + (element.selector || element.xpath) + ' is not visible';
		}

		/**
		 * Tests if the given SulfideElement is visble.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {Promise} Resolves with true when the condition is met before the timout, false otherwise
		 */
		async test(element) {
			let domElement;
			try {
				if ( element.selector ) {
					domElement = await (await Sulfide.getFirstPage()).$(element.selector);
				} else if ( element.xpath ){
					domElement = await (await Sulfide.getFirstPage()).$x(element.xpath);
				}
			} catch (err) {
		//		console.log(err)
			}

			if ( Array.isArray(domElement) ) {
				if ( domElement.length > 0 ) {
					domElement = domElement[0];
				} else {
					domElement = null;
				}
			}
			if ( !domElement ) {
				this.elementExists = false;
				return false;
			}

			this.elementExists = true;

			const boundingBox = await domElement.boundingBox();
			return !!boundingBox;
		}
	}

	// Factory function to create VisibleCondition
	const visible = timeout => new VisibleCondition(timeout);

	// Add shortcut functions to the SulfideElement class
	SulfideElement.prototype.shouldBeVisible = async function(timeout) {
		return this.should(visible(timeout));
	};
	SulfideElement.prototype.shouldNotBeVisible = async function(timeout) {
		return this.shouldNot(visible(timeout));
	};

	return {
		exist,
		visible,
	};
};
