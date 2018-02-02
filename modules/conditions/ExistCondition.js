module.exports = (Sulfide, SulfideElement, Condition) => {

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
            const domElement = await this.getDomElement(element);
            return !!domElement;
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

    return {
        class: ExistCondition,
        factory: exist,
        factoryName: 'exist',
    };
};
