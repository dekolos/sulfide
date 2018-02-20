describe('LengthCondition', () => {
	it('tests if a collection of elements has a certain number of elements', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldHave(length(6)); // eslint-disable-line no-magic-numbers
	});

	zit('fails if a collection of elements does not have a certain number of elements', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldHave(length(10)); // eslint-disable-line no-magic-numbers
	});

	it('tests if a collection of elements has a certain number of elements with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldHaveLength(6); // eslint-disable-line no-magic-numbers
	});

	it('tests if a collection of elements does not have a certain number of elements', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldNotHave(length(10)); // eslint-disable-line no-magic-numbers
	});

	zit('fails if a collection of elements does have a certain number of elements', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldNotHave(length(6)); // eslint-disable-line no-magic-numbers
	});

	it('tests if a collection of elements does not have a certain number of elements with the shortcut method', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $$('li').shouldNotHaveLength(10); // eslint-disable-line no-magic-numbers
	});

	it('throws an error when not used on a SulfideElementCollection', async () => {
		const foo = {
			bar: () => {},
		};
		spyOn(foo, 'bar');

		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		try {
			await $('li').shouldHave(length(6)); // eslint-disable-line no-magic-numbers
		} catch (err) {
			foo.bar();
		}

		expect(foo.bar).toHaveBeenCalled();
	});
});
