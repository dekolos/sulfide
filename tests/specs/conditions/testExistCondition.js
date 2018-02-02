describe('ExistCondition', () => {
	it('should check if an element exists', async () => {
		await $.open('https://www.example.com');
		await $('h1').should(exist());
	});

    it('should check if an element exists with the shortcut method shouldExist', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldExist();
	});

	it('should check if an element does not exist', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNot(exist());
	});

	it('should check if an element does not exist with the shortcut method shouldNotExist', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotExist();
	});
});
