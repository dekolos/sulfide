describe('VisibleCondition', () => {
	it('should check if an element is visble', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldBe(visible());
	});

	it('should check if an element exists with the shortcut method shouldBeVisible', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldBeVisible();
	});

	it('should check if an element is not visible', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotBe(visible());
	});

	it('should check if an element is not visible with the shortcut method shouldNotBeVisible', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotBeVisible();
	});
});
