// Normally Sulfide would be installed with yarn and required like this:
// const s2 = require('sulfide');
// but since we are running the examples from the Sulfide repository we
// haven't installed it.
require('../../modules/Sulfide');

// Some configurations for Sulfide
$.configure({
	jasmine: true,
	implicitWaitTime: 500,
	width: 1200,
	height: 800,
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;


describe('Test example', () => {
	it('should be able to open example.com', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldExist();
		await $('h1').should(exist());
		await $('h11').shouldNot(exist());
		await $('h11').shouldNotExist();
		await $('h1').shouldBeVisible();
		await $('h1').shouldBe(visible());
		await $('h11').shouldNotBeVisible();
		await $('h11').shouldNotBe(visible());
		await $.byText('Example Domain').shouldExist();
		await $(byText('Example Domain')).shouldExist();
		await $(byText('Example Domain')).should(exist());
		await $.withText('ample Do').shouldExist();
		await $(withText('ample Do')).shouldExist();
		await $.byTextCaseInsensitive('eXaMpLE dOmAiN').shouldExist();
		await $(byTextCaseInsensitive('eXaMpLE dOmAiN')).shouldExist();
		await $.withTextCaseInsensitive('aMpLE dO').shouldExist();
		await $(withTextCaseInsensitive('aMpLE dO')).shouldExist();
	});

	it('should be able to log in', async () => {
		await $.open('https://rotous.github.io/sulfide/tests/loginform/');
		await $('#username').sendKeys('user1');
		await $('#password').sendKeys('user1password');
		await $.byValue('Login').click();
		await $.byText('Welcome user1').shouldExist(20000); // Wait for max 20 seconds
	});
});
