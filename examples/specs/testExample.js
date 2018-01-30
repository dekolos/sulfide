// Normally Sulfide would be installed with yarn and required like this:
// const s2 = require('sulfide');
// but since we are running the examples from the Sulfide repository we
// haven't installed it.
require('../../modules/Sulfide');

// Some configurations for Sulfide
$.configure({
	jasmine: true,
	implicitWaitTime: 4000,
	width: 1200,
	height: 800,
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;


describe('Test example', () => {
	it('should be able to open example.com', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldExist();
		await $.byText('Example Domain').shouldExist();
		await $.withText('ample Do').shouldExist();
		await $.byTextCaseInsensitive('eXaMpLE dOmAiN').shouldExist();
		await $.withTextCaseInsensitive('aMpLE dO').shouldExist();
	});

	it('should be able to log in', async () => {
		await $.open('https://rotous.github.io/sulfide/tests/loginform/');
		await $('#username').sendKeys('user1');
		await $('#password').sendKeys('user1password');
		await $.byValue('Login').click();
		await $.byText('Welcome user1').shouldExist(20000); // Wait for max 20 seconds
	});
});
