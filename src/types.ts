export type HexString = `0x${string}`;
export type Arrayable<T> = T | Array<T>;
export type Enumerate<E extends string | number> = E extends string
	? `${E}`
	: `${E}` extends `${infer T extends number}`
	? T
	: never;
