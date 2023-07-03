import AJVModule from 'ajv';
import schema from './schema.js';

const isTokenList = new AJVModule({
	allErrors: true,
	verbose: true,
	allowUnionTypes: true,
	formats: {
		'date-time': {
			validate:
				/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
			compare(dt1: string, dt2: string) {
				if (!(dt1 && dt2)) return;
				const d1 = new Date(dt1).valueOf();
				const d2 = new Date(dt2).valueOf();
				if (!(d1 && d2)) return;
				return d1 - d2;
			}
		},
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/
	}
}).compile<typeof schema>(schema);

export default isTokenList;
