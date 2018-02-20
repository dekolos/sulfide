describe('ExistCondition', () => {
	it('checks if an element exists', async () => {
		await $.open('https://www.example.com');
		await $('h1').should(exist());
	});

	zit('fails if an element does not exists', async () => {
		await $.open('https://www.example.com');
		await $('h2').should(exist());
	});

	it('checks if an element exists with the shortcut method shouldExist', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldExist();
	});

	it('checks if an element does not exist', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNot(exist());
	});

	zit('fails if an element does exist', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldNot(exist());
	});

	it('checks if an element does not exist with the shortcut method shouldNotExist', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotExist();
	});
});
