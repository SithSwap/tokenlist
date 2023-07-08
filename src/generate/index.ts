import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import generateLists from './list.js';
import generateLogos from './logos.js';
import { parse } from '$src/utilities/version.js';

function path(file: string) {
	return fileURLToPath(new URL(file, import.meta.url));
}

const output = '../dist/';

const { version = '0.0.0' } = await fs.readFile(path('../package.json'), 'utf-8').then(JSON.parse);

generateLists(path('./tokens'), path(`${output}`), parse(version));
generateLogos(path('./logos'), path(`${output}/logos`));
