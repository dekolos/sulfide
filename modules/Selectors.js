module.exports = (Sulfide, SulfideElement) => ({
	/**
	 * Selects an element with the full text given
	 * @param  {String} text The entire text of the element that should be selected.
	 * @return {SulfideElement} SulfideElement wrapper of the element.
	 */
	byText: text => {
		const xpath = '//*[text()="' + text + '"]';
		return new SulfideElement(xpath, 'byText(\'' + text + '\')');
	},

	/**
	 * Selects an element that contains the text given
	 * @param  {String} text The text that should be part of the text in the element that should be selected.
	 * @return {SulfideElement} SulfideElement wrapper of the element.
	 */
	withText: text => {
		const xpath = '//*[contains(text(), "' + text + '")]';
		return new SulfideElement(xpath, 'withText(\'' + text + '\')');
	},

	/**
	 * Selects an element with the full text given
	 * @param  {String} text The entire text of the element that should be selected.
	 * @return {SulfideElement} SulfideElement wrapper of the element.
	 */
	byTextCaseInsensitive: text => {
		const xpath = '//*[translate(text(), "' + text.toUpperCase() + '", "' + text.toLowerCase() + '")="' + text.toLowerCase() + '"]';
		return new SulfideElement(xpath, 'byTextCaseInsensitive(\'' + text + '\')');
	},

	/**
	 * Selects an element that contains the text given
	 * @param  {String} text The text that should be part of the text in the element that should be selected.
	 * @return {SulfideElement} SulfideElement wrapper of the element.
	 */
	withTextCaseInsensitive: text => {
		const xpath = '//*//text()[contains(translate(., "' + text.toUpperCase() + '", "' + text.toLowerCase() + '"), "' + text.toLowerCase() + '")]';
		return new SulfideElement(xpath, 'withTextCaseInsensitive(\'' + text + '\')');
	},

	/**
	 * Selects an element with the full text given
	 * @param  {String} text The entire text of the element that should be selected.
	 * @return {SulfideElement} SulfideElement wrapper of the element.
	 */
	byValue: value => {
		const xpath = '//*[@value="' + value + '"]';
		return new SulfideElement(xpath, 'byValue(\'' + value + '\')');
	},
});
