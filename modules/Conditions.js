module.exports = (Sulfide, SulfideElement) => {
	/**
	 * Base class for conditions.
	 */
	class Condition {
		/**
		 * Main function of the condition. Will return true or false to
		 * denote that the condition is met or not for the given SulfideElement.
		 * Conditions should extend this class and implement this function.
		 *
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {Boolean} True if the condition is met for the given element, false otherwise.
		 */
		test(element) {
			return false;
		}
	}

	/**
	 * Condition to test if an element exists on the page.
	 */
	class ExistCondition extends Condition {
		constructor(timeout) {
			super();

			this.timeout = timeout || Sulfide.config.implicitWaitTime;
		}

		async test(element) {
			let el;
			const options = {
				timout: this.timeout,
			};

			const t0 = new Date().getTime();

			// NOTE: waitForXPath is not defined in v1.0.0 of puppeteer
			// and also the timeout doesn't work in waitForSelector
			// so we must implement our own polling function
			const poll = async (resolve, reject) => {
				const found = await this.elementExists(element);
				if ( found ){
					resolve(true);
					return true;
				}

				if ( new Date().getTime() - t0 > this.timeout ){
					resolve(false);
					if ( Sulfide.config.jasmine ) {
						// Make jasmine fail the spec
						fail('Element ' + (element.selector || element.xpath) + ' not found');
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

		async elementExists(element) {
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

	// Add a shortcut function to the SulfideElement class
	SulfideElement.prototype.shouldExist = async function(timeout) {
		return this.should(exist(timeout));
	};

	return {
		exist,
	};
};
