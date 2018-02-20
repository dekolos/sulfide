const Sulfide = require('../../modules/Sulfide');
const SulfideElement = require('../../modules/SulfideElement')(Sulfide);

describe('SulfideElement', () => {
	it('returns null when no selector is given', async () => {
		const el = new SulfideElement();
		const domElement = await el.getDomElement();

		expect(domElement).toBe(null);
	});
});
