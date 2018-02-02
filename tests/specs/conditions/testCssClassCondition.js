describe('CssClassCondition', () => {
	it('should check if an element has a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHave(cssClass('title'));
	});

	it('should check if an element has a css class with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHaveCssClass('title');
	});

	it('should check if an element does not have a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').shouldNotHave(cssClass('username'));
	});

	it('should check if an element does not have a css class with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').shouldNotHaveCssClass('username');
	});
});
