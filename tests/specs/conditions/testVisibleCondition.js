describe('VisibleCondition', () => {
	it('checks if an element is visble', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldBe(visible());
	});

	/* We don't have a test page yet with hidden elements
	zit('fails if an element is not visble', async () => {
		await $.open('https://www.example.com');
		await $('.hidden').shouldBe(visible());
	});
	*/

	zit('fails if an element does not exist', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldBe(visible());
	});

	it('checks if an element exists with the shortcut method shouldBeVisible', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldBeVisible();
	});

	it('checks if an element is not visible', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotBe(visible());
	});

	zit('fails if an element is visible', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldNotBe(visible());
	});

	it('checks if an element is not visible with the shortcut method shouldNotBeVisible', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotBeVisible();
	});
});
