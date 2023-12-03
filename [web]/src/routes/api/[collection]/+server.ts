import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params: { collection }, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const page = url.searchParams.get('page') || '1';
	const perPage = url.searchParams.get('perPage') || '50';
	const sort = url.searchParams.get('sort') || '-created,id';
	const filter = url.searchParams.get('filter');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');

	const options: PbFilter = { sort };
	if (filter) options.filter = filter;
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	const data = await locals.pb
		.collection(collection)
		.getList(parseInt(page), parseInt(perPage), options);
	return json(data);
}