module.exports = Sulfide => {
	const SulfideElement = require('./SulfideElement')(Sulfide);

	return {
		/**
		 * Selects an element with the full text given
		 * @param  {String} text The entire text of the element that should be selected.
		 * @return {SulfideElement} SulfideElement wrapper of the element.
		 */
		byText: text => {
			const xpath = '//*[text()="' + text + '"]';
			return new SulfideElement(xpath);
		},

		/**
		 * Selects an element that contains the text given
		 * @param  {String} text The text that should be part of the text in the element that should be selected.
		 * @return {SulfideElement} SulfideElement wrapper of the element.
		 */
		withText: text => {
			const xpath = '//*[contains(text(), "' + text + '")]';
			return new SulfideElement(xpath);
		},

		/**
		 * Selects an element with the full text given
		 * @param  {String} text The entire text of the element that should be selected.
		 * @return {SulfideElement} SulfideElement wrapper of the element.
		 */
		byTextCaseInsensitive: text => {
			const xpath = '//*[translate(text(), "' + text.toUpperCase() + '", "' + text.toLowerCase() + '")="' + text.toLowerCase() + '"]';
			return new SulfideElement(xpath);
		},

		/**
		 * Selects an element that contains the text given
		 * @param  {String} text The text that should be part of the text in the element that should be selected.
		 * @return {SulfideElement} SulfideElement wrapper of the element.
		 */
		withTextCaseInsensitive: text => {
			const xpath = '//*//text()[contains(translate(., "' + text.toUpperCase() + '", "' + text.toLowerCase() + '"), "' + text.toLowerCase() + '")]';
			return new SulfideElement(xpath);
		},

		/**
		 * Selects an element with the full text given
		 * @param  {String} text The entire text of the element that should be selected.
		 * @return {SulfideElement} SulfideElement wrapper of the element.
		 */
		byValue: value => {
			const xpath = '//*[@value="' + value + '"]';
			return new SulfideElement(xpath);
		},
	};
};
