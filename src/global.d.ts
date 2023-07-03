type HexString = `0x${string}`;
type Arrayable<T> = T | Array<T>;
type Enumerate<E extends string | number> = E extends string
	? `${E}`
	: `${E}` extends `${infer T extends number}`
	? T
	: never;
