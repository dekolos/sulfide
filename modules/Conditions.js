const fs = require('fs');

module.exports = (Sulfide, SulfideElement, SulfideElementCollection) => {
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
		async test(element) { // eslint-disable-line class-methods-use-this
			/* istanbul ignore next */
			return false;
		}

		getFailureMessage(element) { // eslint-disable-line class-methods-use-this
			/* istanbul ignore next */
			return 'Condition not met';
		}

		async poll(element, negate) {
			negate = Boolean(negate); // eslint-disable-line no-param-reassign
			const t0 = new Date().getTime();

			// NOTE: waitForXPath is not defined in v1.0.0 of puppeteer
			// and also the timeout doesn't work in waitForSelector
			// so we must implement our own polling function
			const poll = async (resolve, reject) => {
				let conditionMet;
				try {
					conditionMet = await this.test(element);
				} catch (err) {
					reject(err);
					return false;
				}

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

	// Read the conditions from the conditions directory
	let files = fs.readdirSync(__dirname + '/conditions');
	const factories = {};
	files.forEach(file => {
		const condition = require('./conditions/' + file)(Sulfide, SulfideElement, Condition); // eslint-disable-line global-require
		factories[condition.factoryName] = condition.factory;
	});

	// Read the collection conditions from the collectionConditions directory
	files = fs.readdirSync(__dirname + '/collectionConditions');
	files.forEach(file => {
		const condition = require('./collectionConditions/' + file)(Sulfide, SulfideElementCollection, Condition); // eslint-disable-line global-require
		factories[condition.factoryName] = condition.factory;
	});

	return factories;
};
