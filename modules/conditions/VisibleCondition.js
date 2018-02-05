module.exports = (Sulfide, SulfideElement, Condition) => {
	/**
	 * Condition to test if an element exists on the page.
	 */
	class VisibleCondition extends Condition {
		constructor(timeout) {
			super(timeout);
			this.elementExists = false;
		}

		/**
		 * Returns the message that will be passed to Jasmine when the condition is not met.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {String} The failure message for this condition
		 */
		getFailureMessage(element, negate) {
			if ( negate ) {
				return 'Element ' + (element.selector || element.xpath) + ' is visible';
			}

			if ( !this.elementExists ) {
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
			const domElement = await this.getDomElement(element);

			if ( !domElement ) {
				this.elementExists = false;
				return false;
			}

			this.elementExists = true;

			const boundingBox = await domElement.boundingBox();
			return Boolean(boundingBox);
		}
	}

	// Factory function to create VisibleCondition
	const visible = timeout => new VisibleCondition(timeout);

	// Add shortcut functions to the SulfideElement class
	SulfideElement.prototype.shouldBeVisible = async function shouldBeVisible(timeout) {
		return this.should(visible(timeout));
	};
	SulfideElement.prototype.shouldNotBeVisible = async function shouldNotBeVisible(timeout) {
		return this.shouldNot(visible(timeout));
	};

	return {
		class: VisibleCondition,
		factory: visible,
		factoryName: 'visible',
	};
};
