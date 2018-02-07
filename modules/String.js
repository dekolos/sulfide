global.String.prototype.isXPath = function isXPath() {
	return this.substr(0, 2) === '//';
};
