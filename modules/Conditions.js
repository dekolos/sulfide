const fs = require('fs');

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
			return 'Condition not met';
		}

		async getDomElement(element) {
			let domElement;
			let baseElement;
			let selector;
			const parents = [...element.parents];
			try {
				if ( parents.length ) {
					selector = parents.shift();
					if ( selector.substr(0, 2) === '//' ) {
						baseElement = await (await Sulfide.getFirstPage()).$x(element.xpath);
					} else {
						baseElement = await (await Sulfide.getFirstPage()).$(selector);
					}
					if ( Array.isArray(baseElement) ) {
						if ( baseElement.length > 0 ) {
							baseElement = domElement[0];
						} else {
							baseElement = null;
						}
					}
					if ( !baseElement ) {
						return null;
					}
				}

				while ( parents.length ) {
					selector = parents.shift();
					if ( selector.substr(0, 2) === '//' ) {
						baseElement = await baseElement.$x(element.xpath); // eslint-disable-line no-await-in-loop
					} else {
						baseElement = await baseElement.$(selector); // eslint-disable-line no-await-in-loop
					}
					if ( Array.isArray(baseElement) ) {
						if ( baseElement.length > 0 ) {
							baseElement = domElement[0];
						} else {
							baseElement = null;
						}
					}
					if ( !baseElement ) {
						return null;
					}
				}

				if ( element.selector ) {
					if ( baseElement ) {
						domElement = await baseElement.$(element.selector);
					} else {
						domElement = await (await Sulfide.getFirstPage()).$(element.selector);
					}
				} else if ( element.xpath ) {
					if ( baseElement ) {
						domElement = await baseElement.$x(element.xpath);
					} else {
						domElement = await (await Sulfide.getFirstPage()).$x(element.xpath);
					}
				}
			} catch (err) {
				// console.log(err)
			}

			if ( Array.isArray(domElement) ) {
				if ( domElement.length > 0 ) {
					domElement = domElement[0];
				} else {
					domElement = null;
				}
			}

			return domElement;
		}

		async poll(element, negate) {
			negate = Boolean(negate); // eslint-disable-line no-param-reassign
			const t0 = new Date().getTime();

			// NOTE: waitForXPath is not defined in v1.0.0 of puppeteer
			// and also the timeout doesn't work in waitForSelector
			// so we must implement our own polling function
			const poll = async (resolve, reject) => {
				const conditionMet = await this.test(element);
				if ( (conditionMet && !negate) || (!conditionMet && negate) ) {
					resolve(true);
					return true;
				}

				if ( new Date().getTime() - t0 > this.timeout ) {
					resolve(false);
					if ( Sulfide.config.jasmine ) {
						// Make jasmine fail the spec
						fail(this.getFailureMessage(element, negate));
					}
					return false;
				}

				setTimeout(poll, Sulfide.config.pollInterval, resolve, reject);
				return false;
			};

			return new Promise( (resolve, reject) => {
				poll(resolve, reject);
			});
		}
	}

	// Read the conditions from the condtions directory
	const files = fs.readdirSync(__dirname + '/conditions');
	const factories = {};
	files.forEach(file => {
		const condition = require('./conditions/' + file)(Sulfide, SulfideElement, Condition); // eslint-disable-line global-require
		factories[condition.factoryName] = condition.factory;
	});

	return factories;
};
