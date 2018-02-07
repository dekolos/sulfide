module.exports = (Sulfide, SulfideElement, Condition) => {
	/**
	 * Condition to test if an element has the given CSS class.
	 */
	class CssClassCondition extends Condition {
		constructor(cssClass, timeout) {
			super(timeout);
			this.cssClass = cssClass;
			this.elementExists = false;
		}

		/**
		 * Returns the message that will be passed to Jasmine when the condition is not met.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {String} The failure message for this condition
		 */
		getFailureMessage(element, negate) {
			if ( negate ) {
				return 'Element ' + (element.selector || element.xpath) + ' does have CSS class "' + this.cssClass + '""';
			}

			if ( !this.elementExists ) {
				return 'Element ' + (element.selector || element.xpath) + ' not found, so does not have CSS class "' + this.cssClass + '""';
			}

			return 'Element ' + (element.selector || element.xpath) + ' does not have CSS class "' + this.cssClass + '""';
		}

		/**
		 * Tests if the given SulfideElement has the given CSS class.
		 * @param  {SulfideElement} element The element for which the condition will be tested
		 * @return {Promise} Resolves with true when the condition is met before the timout, false otherwise
		 */
		async test(element) {
			const domElement = await element.getDomElement();

			if ( !domElement ) {
				this.elementExists = false;
				return false;
			}

			this.elementExists = true;

			const classString = await (await Sulfide.getPage()).evaluate(el => el.getAttribute('class'), domElement);
			if ( !classString ) {
				return false;
			}
			const classList = classString.split(' ');
			return classList.some(className => className === this.cssClass);
		}
	}

	// Factory function to create VisibleCondition
	const cssClass = (css, timeout) => new CssClassCondition(css, timeout);

	// Add shortcut functions to the SulfideElement class
	SulfideElement.prototype.shouldHaveCssClass = async function shouldHaveCssClass(css, timeout) {
		return this.should(cssClass(css, timeout));
	};
	SulfideElement.prototype.shouldNotHaveCssClass = async function shouldNotHaveCssClass(css, timeout) {
		return this.shouldNot(cssClass(css, timeout));
	};

	return {
		class: CssClassCondition,
		factory: cssClass,
		factoryName: 'cssClass',
	};
};
