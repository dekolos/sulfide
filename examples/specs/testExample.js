const s2 = require('../../Sulfide');
s2.configure({
	jasmine: true,
	implicitWaitTime: 4000,
	width: 800,
	height: 600,
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;


describe('Test example', () => {
	it('should be able to open example.com', async () => {
		await s2.open('https://www.example.com');
		await s2('h1').shouldExist();
		await s2.byText('Esxample Domain').shouldExist();
		await s2.byText('Example Domain').shouldExist();
		await s2.withText('ample Do').shouldExist();
		await s2.byTextCaseInsensitive('eXaMpLE dOmAiN').shouldExist();
		await s2.withTextCaseInsensitive('aMpLE dO').shouldExist();
	});

	it('should be able to log in', async () => {
		await s2.open('https://127.0.0.1/kopano?logout');
		await s2('#username').sendKeys('user1');
		await s2('#password').sendKeys('user1');
		await s2.byValue('Sign in').click();
		await s2('#zarafa-mainmenu').shouldExist(20000); // Wait for max 20 seconds
	});
});
