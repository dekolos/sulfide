// Normally Sulfide would be installed with yarn and required like this:
// const s2 = require('sulfide');
// but since we are running the examples from the Sulfide repository we
// haven't installed it.
const Sulfide = require('../../modules/Sulfide');

// Some configurations for Sulfide
Sulfide.configure({
	jasmine: true,
	implicitWaitTime: 500,
	width: 1200,
	height: 800,
	disableInfobars: false,
});
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;


describe('Test example', () => {
	it('should be able to open example.com', async () => {
		await $.open('https://www.example.com');
	});

	it('should be able to check if an element exists', async () => {
		await $.open('https://www.example.com');
		await $('h1').should(exist());

		// Identical test with the shortcut method shouldExist()
		await $('h1').shouldExist();
	});

	it('should be able to check if an element does not exists', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNot(exist());

		// Identical test with the shortcut method shouldNotExist()
		await $('h2').shouldNotExist();
	});

	it('should be able to check if an element is visible', async () => {
		await $.open('https://www.example.com');
		await $('h1').shouldBe(visible());

		// Identical test with the shortcut method shouldBeVisible()
		await $('h1').shouldBeVisible();
	});

	it('should be able to check if an element is not visible', async () => {
		await $.open('https://www.example.com');
		await $('h2').shouldNotBe(visible());

		// Identical test with the shortcut method shouldNotBeVisible()
		await $('h2').shouldNotBeVisible();
	});

	it('should be able to select an element by text', async () => {
		await $.open('https://www.example.com');
		await $(byText('Example Domain')).should(exist());
		await $.byText('Example Domain').should(exist());
	});

	it('should be able to select an element containing text', async () => {
		await $.open('https://www.example.com');
		await $(withText('ample Do')).should(exist());
		await $.withText('ample Do').should(exist());
	});

	it('should be able to select an element by text (case-insensitive)', async () => {
		await $.open('https://www.example.com');
		await $(byTextCaseInsensitive('eXaMpLE dOmAiN')).should(exist());
		await $.byTextCaseInsensitive('eXaMpLE dOmAiN').should(exist());
	});

	it('should be able to select an element containing text (case-insensitive)', async () => {
		await $.open('https://www.example.com');
		await $(withTextCaseInsensitive('aMpLE dO')).should(exist());
		await $.withTextCaseInsensitive('aMpLE dO').should(exist());
	});

	it('should be able to check for css classes', async () => {
		await $.open('https://rotous.github.io/sulfide/tests/loginform/');
		await $('.title').shouldHave(cssClass('title'));
		await $('#username').shouldNotHave(cssClass('username'));
	});

	it('should be able to log in', async () => {
		await $.open('https://rotous.github.io/sulfide/tests/loginform/');
		await $('#username').sendKeys('user1');
		await $('#password').sendKeys('user1password');
		await $.byValue('Login').click();
		await $.byText('Welcome user1').shouldExist(20000); // Wait for max 20 seconds
	});
});
