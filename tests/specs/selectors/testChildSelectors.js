describe('Child selectors', () => {
	it('finds a child with a css selector', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find('div.header').should(exist());
	});

	it('finds a child with a css selector using the $ alias for find', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').$('div.header').should(exist());
	});

	it('finds a child with a selector function', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find(byText('Sulfide Example To Do List')).should(exist());
	});

	it('finds a child by chaining selectors', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find('div.header').find('h2').should(exist());
	});

	it('finds a child by chaining and using a selector function', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find('div.header').find(byText('Sulfide Example To Do List')).should(exist());
	});

	it('does not find a child of a non-existing parent with a css selector', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('bodie').find('div.header').shouldNot(exist());
	});

	it('does not find a child of a non-existing parent with a selector function', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('bodie').find(byText('Sulfide Example To Do List')).shouldNot(exist());
	});

	it('does not find a non-existing child of a parent with a css selector', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find('div.headerssss').shouldNot(exist());
	});

	it('does not find a non-existing child of a parent with a selector function', async () => {
		await $.open('https://dekolos.github.io/sulfide/tests/todo/todo.html');
		await $('body').find(byText('Selenide Example To Do List')).shouldNot(exist());
	});
});
