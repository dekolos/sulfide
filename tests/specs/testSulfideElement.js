const Sulfide = require('../../modules/Sulfide');
const SulfideElement = require('../../modules/SulfideElement')(Sulfide);

describe('SulfideElement', () => {
	it('returns null when no selector is given', async () => {
		const el = new SulfideElement();
		const domElement = await el.getDomElement();

		expect(domElement).toBe(null);
	});

	it('clears an input', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/loginform/');
		await $('#username').sendKeys('user1');
		let value = await $('#username').getValue();
		expect(value).toEqual('user1');

		await $('#username').clear();
		value = await $('#username').getValue();
		expect(value).toEqual('');
	});
});
