describe('Selectors', () => {
	it('should select an element with a queryselector', async () => {
		await $.open('https://www.example.com');
		await $('h1').should(exist());
	});

	it('should select an element by text', async () => {
		await $.open('https://www.example.com');
		await $(byText('Example Domain')).should(exist());
	});

	it('should select an element by text with the shortcut method $.byText', async () => {
		await $.open('https://www.example.com');
		await $.byText('Example Domain').should(exist());
	});

	it('should select an element containing text', async () => {
		await $.open('https://www.example.com');
		await $(withText('ample Do')).should(exist());
	});

	it('should select an element containing text with the shortcut method $.withText', async () => {
		await $.open('https://www.example.com');
		await $.withText('ample Do').should(exist());
	});

	it('should select an element by text (case-insensitive)', async () => {
		await $.open('https://www.example.com');
		await $(byTextCaseInsensitive('eXaMpLE dOmAiN')).should(exist());
	});

	it('should select an element by text (case-insensitive) with the shortcut method $.byTextCaseInsensitive', async () => {
		await $.open('https://www.example.com');
		await $.byTextCaseInsensitive('eXaMpLE dOmAiN').should(exist());
	});

	it('should select an element containing text (case-insensitive)', async () => {
		await $.open('https://www.example.com');
		await $(withTextCaseInsensitive('aMpLE dO')).should(exist());
	});

	it('should select an element containing text (case-insensitive) with the shortcut method $.withTextCaseInsensitive', async () => {
		await $.open('https://www.example.com');
		await $.withTextCaseInsensitive('aMpLE dO').should(exist());
	});
});
