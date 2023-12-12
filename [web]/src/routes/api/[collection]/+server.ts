import { getList, type PbFilter } from '$lib/pocketbase';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params: { collection }, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const page = url.searchParams.get('page') || '1';
	const perPage = url.searchParams.get('perPage') || '50';
	const sort = url.searchParams.get('sort') || '-created,id';
	const filter = url.searchParams.get('filter');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');
	const requestKey = url.searchParams.get('requestKey') || `${collection}List`;

	const options: PbFilter = { sort, requestKey };
	if (filter) options.filter = filter;
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	const list = await getList({
		...options,
		collection: 'job',
		page: parseInt(page),
		perPage: parseInt(perPage),
	});

	return json(list);
}
