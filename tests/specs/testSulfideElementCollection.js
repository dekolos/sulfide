const Sulfide = require('../../modules/Sulfide');
const SulfideElement = require('../../modules/SulfideElement')(Sulfide);
const SulfideElementCollection = require('../../modules/SulfideElementCollection')(Sulfide, SulfideElement);

describe('SulfideElementCollection', () => {
	it('$$ selects multiple elements', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldHave(length(6)); // eslint-disable-line no-magic-numbers
	});

	it('returns an empty array when no selector is given', async () => {
		const collection = new SulfideElementCollection();
		const domElements = await collection.getDomElements();

		expect(domElements.length).toBe(0);
	});

	it('getDomElements throws an exception when using an functional selector', async () => {
		const foo = {
			bar: () => {},
		};
		spyOn(foo, 'bar');

		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		try {
			await $$(byText('Sulfide Example To Do List')).shouldHave(length(1)); // eslint-disable-line no-magic-numbers
		} catch (err) {
			foo.bar();
		}

		expect(foo.bar).toHaveBeenCalled();
	});
});
