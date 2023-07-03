import { parse } from './version.js';

describe('Parse Version String', function () {
	it.each([
		['1.2.3', { major: 1, minor: 2, patch: 3 }],
		['0.0.2', { major: 0, minor: 0, patch: 2 }]
	])('parses %s to %s', (input, expected) => {
		expect(parse(input)).toEqual(expected);
	});

	it.each([[''], [undefined], [{}], [1.2]])('throws on invalid input', input => {
		expect(() => parse(input as string)).toThrow();
	});
});
