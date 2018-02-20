module.exports = (Sulfide, SulfideElement) => (
	/**
	 * A SulfideElementCollection represents a list of DOM Elements specified by a selector.
	 * It can be used to run checks on DOM Elements, e.g. if there exist a certain number of
	 * those elements.
	 */
	class SulfideElementCollection extends SulfideElement {
		/**
		 * Returns a an array of DOM Elements based on the selectors of this
		 * collection
		 * @return {Promise} Resolves to an array with DOM Elements
		 */
		async getDomElements() {
			// Start with the page as base to find the elements
			let domElement = await Sulfide.getPage();
			const selectors = [...this.selectors];

			if ( selectors.length === 0 ) {
				// An collection without selectors is empty
				return [];
			}

			while ( selectors.length ) {
				const selector = selectors.shift();
				if ( selector.isXPath() ) {
					if ( selectors.length === 0 ) {
						throw new Error('Collection selector cannot be an xpath');
					}
					domElement = await domElement.$x(selector); // eslint-disable-line no-await-in-loop
					domElement = domElement.length > 0 ? domElement[0] : null;
				} else if ( selectors.length === 0 ) {
					// Last selector should be for a collection
					domElement = await domElement.$$(selector); // eslint-disable-line no-await-in-loop
				} else {
					domElement = await domElement.$(selector); // eslint-disable-line no-await-in-loop
				}

				if ( !domElement ) {
					return null;
				}
			}

			return domElement;
		}
	}
);
