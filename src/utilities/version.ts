export type Version = { major: number; minor: number; patch: number };

export function parse(input: string): Version {
	if (!input) throw new Error('Invalid input');

	if (typeof input != 'string') throw new Error('Invalid input');

	const [major, minor, rest] = input.split('.');

	return {
		major: parseInt(major) || 0,
		minor: parseInt(minor) || 0,
		patch: parseInt(rest) || 0
	};
}
