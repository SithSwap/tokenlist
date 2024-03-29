import fs from 'fs/promises';
import path from 'path';
import fg from 'fast-glob';
import SVGSpriter from 'svg-sprite';
import { optimize, type Config as SVGOConfig } from 'svgo';

const BaseSVGSpriterConfig: SVGSpriter.Config = {
	mode: { symbol: true },
	shape: { transform: [{}] },
	svg: {
		xmlDeclaration: false,
		doctypeDeclaration: false,
		namespaceIDs: false,
		namespaceClassnames: false,
		dimensionAttributes: false,
		rootAttributes: {
			width: '0',
			height: '0',
			'aria-hidden': 'true'
		}
	}
};

const SVGOConfig: SVGOConfig = {
	multipass: true,
	js2svg: { indent: 2, pretty: true },
	plugins: [
		{
			name: 'preset-default',
			params: { overrides: { cleanupIds: false } }
		},
		{
			name: 'removeAttrs',
			params: { attrs: '(style|xmlns)' }
		}
	]
};

type Meta = Record<string, { symbol: string; id?: string; color?: string }>;

async function getMeta(folder: string) {
	try {
		const content = await fs.readFile(path.resolve(folder, 'meta.json'), 'utf-8');
		return JSON.parse(content) as Meta;
	} catch {
		return {} as Meta;
	}
}

async function generate(from: string, to: string, folder: string) {
	const config = structuredClone(BaseSVGSpriterConfig);

	config.shape = config.shape ?? {};

	const Meta = await getMeta(path.resolve(from, folder));

	const info = {} as Record<string, { logo: string; color: string }>;

	config.shape.id = {
		...config.shape.id,
		generator: name => {
			const meta = Meta[name];
			const id = meta?.id ?? `token-${folder}-${name.replace('.svg', '')}`;
			if (meta) info[meta.symbol] = { logo: `#${id}`, color: meta.color ?? '#000' };
			return id;
		}
	};

	const spriter = new SVGSpriter(config);
	const entries = await fg([`${from}/${folder}/*.svg`]);

	await Promise.all(
		entries.map(entry =>
			fs.readFile(entry, 'utf-8').then(content => spriter.add(entry, null, content))
		)
	);

	const { result: compiled } = await spriter.compileAsync();

	const { data: optimized } = optimize(compiled.symbol.sprite.contents, SVGOConfig);

	await fs.writeFile(path.join(to, `${folder}.svg`), optimized);
	if (Object.keys(info).length)
		await fs.writeFile(path.join(to, `${folder}.json`), JSON.stringify(info, null, 2));
}

export default async function (from: string, to: string) {
	await fs.mkdir(to, { recursive: true });
	const paths = await fs.readdir(from, { withFileTypes: true });
	const tasks = new Array<Promise<void>>();
	for (const path of paths) {
		if (path.isDirectory()) tasks.push(generate(from, to, path.name));
	}
	await Promise.all(tasks);
}
