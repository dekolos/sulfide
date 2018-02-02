describe('Some example tests', () => {
	it('should be able to log in', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').sendKeys('user1');
		await $('#password').sendKeys('user1password');
		await $.byValue('Login').click();
		await $.byText('Welcome user1').shouldExist(20000); // Wait for max 20 seconds
	});
});
