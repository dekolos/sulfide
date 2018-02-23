describe('Sulfide', () => {
	it('can be configured to run headless or with head', () => {
		$.configure({
			headless: false,
		});
		let options = $.getBrowserLaunchOptions();
		expect(options.headless).toBe(false);

		$.configure({
			headless: true,
		});
		options = $.getBrowserLaunchOptions();
		expect(options.headless).toBe(true);
	});

	it('can be configured to ignore https errors or not to ignore them', () => {
		$.configure({
			ignoreHTTPSErrors: true,
		});
		let options = $.getBrowserLaunchOptions();
		expect(options.ignoreHTTPSErrors).toBe(true);

		$.configure({
			ignoreHTTPSErrors: false,
		});
		options = $.getBrowserLaunchOptions();
		expect(options.ignoreHTTPSErrors).toBe(false);
	});

	it('can be configured to start with dev tools open or closed', () => {
		$.configure({
			devtools: true,
		});
		let options = $.getBrowserLaunchOptions();
		expect(options.devtools).toBe(true);

		$.configure({
			devtools: false,
		});
		options = $.getBrowserLaunchOptions();
		expect(options.devtools).toBe(false);
	});

	it('can be configured to add chrome arguments', () => {
		$.configure({
			chromeArgs: [
				'--parent-profile /path/to/my/profile',
			],
		});
		const options = $.getBrowserLaunchOptions();
		expect(options.args.indexOf('--parent-profile /path/to/my/profile')).toBeGreaterThan(-1);
	});

	it('throws an error when chrome arguments that are not an array are added to the configuration', () => {
		expect(() => {
			$.configure({
				chromeArgs: '--parent-profile /path/to/my/profile',
			});
		}).toThrow();
	});

	it('cannot explicitly set some chrome arguments', async () => {
		const options = $.configure({
			width: 500, // eslint-disable-line no-magic-numbers
			height: 400, // eslint-disable-line no-magic-numbers
			disableInfoBars: false,
			chromeArgs: [
				'--window-size=100,200',
				'--app=http://somedomain/somepath',
				'--disable-infobars',
			],
		});
		let filteredArgs = options.chromeArgs.filter(o => o.indexOf('--window-size=') === 0);
		expect(filteredArgs.length).toBe(0, '--window-size incorrectly added to chromium arguments');

		filteredArgs = options.chromeArgs.filter(o => o.indexOf('--app=') === 0);
		expect(filteredArgs.length).toBe(0, '--app=[URL] incorrectly added to chromium arguments');

		filteredArgs = options.chromeArgs.filter(o => o.indexOf('--disable-infobars') === 0);
		expect(filteredArgs.length).toBe(0, '--disable-infobars incorrectly added to chromium arguments');

		// Set the defaults again for the other tests
		$.configure({
			width: 800, // eslint-disable-line no-magic-numbers
			height: 600, // eslint-disable-line no-magic-numbers
			disableInfobars: false,
			chromeArgs: [],
		});
	});

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
