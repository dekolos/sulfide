describe('Sulfide', () => {
	it('closes the browser', async () => {
		await $.open('https://www.example.com');
		await $.close();
		const pages = await $.getPages();
		expect(pages.length).toBe(0);
	});

	it('sleeps', async () => {
		const t0 = new Date().getTime();
		await $.sleep(1000); // eslint-disable-line no-magic-numbers
		const t1 = new Date().getTime();
		expect(t1 - t0).toBeGreaterThan(999); // eslint-disable-line no-magic-numbers
	});

	it('creates a new page when getPage is called with no pages open', async () => {
		await $.open('https://www.example.com');
		const page = await $.getPage();
		await page.close();
		const newPage = await $.getPage();
		expect(Boolean(newPage)).toBe(true);
	});
});
