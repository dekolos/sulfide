describe('CssClassCondition', () => {
	it('checks if an element has a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHave(cssClass('title'));
	});

	zit('fails if an element does not have a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHave(cssClass('subject'));
	});

	it('checks if an element has a css class with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHaveCssClass('title');
	});

	it('checks if an element does not have a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').shouldNotHave(cssClass('username'));
	});

	zit('fails if an element does have a css class', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.title').shouldNotHave(cssClass('title'));
	});

	it('checks if an element does not have a css class with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').shouldNotHaveCssClass('username');
	});

	zit('fails if an element does not exist', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('.subject').shouldHave(cssClass('title'));
	});
});
