module.exports = (Sulfide, SulfideElementCollection, Condition) => {
	/**
	 * Condition to test if an element collection has a certain number
	 * of elements on the page.
	 */
	class LengthCondition extends Condition {
		constructor(length, timeout) {
			super(timeout);
			this.length = Number(length);
			this.actualLength = 0;
		}

		/**
		 * Returns the message that will be passed to Jasmine when the condition is not met.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {String} The failure message for this condition
		 */
		getFailureMessage(element, negate) {
			if ( negate ) {
				return 'Number of found elements is equal to ' + this.length;
			}

			return 'Number of found elements is not equal to ' + this.length + ' but to ' + this.actualLength;
		}

		/**
		 * Tests if the given SulfideElementCollection has the given length
		 * @param  {SulfideElementCollection} elements The elements for which the condition will be tested
		 * @return {Promise} Resolves with true when the condition is met before the timout, false otherwise
		 */
		async test(collection) {
			if ( !(collection instanceof SulfideElementCollection) ) {
				throw new Error('length(number) can only be used on a collection of elements');
			}

			const domElements = await collection.getDomElements();
			this.actualLength = domElements.length;
			return domElements.length === this.length;
		}
	}

	// Factory function to create a LengthCondition
	const length = (count, timeout) => new LengthCondition(count, timeout);

	// Add shortcut functions to the SulfideElementCollection class
	SulfideElementCollection.prototype.shouldHaveLength = async function shouldHaveLength(count, timeout) {
		return this.should(length(count, timeout));
	};
	SulfideElementCollection.prototype.shouldNotHaveLength = async function shouldNotHaveLength(count, timeout) {
		return this.shouldNot(length(count, timeout));
	};

	return {
		class: LengthCondition,
		factory: length,
		factoryName: 'length',
	};
};
