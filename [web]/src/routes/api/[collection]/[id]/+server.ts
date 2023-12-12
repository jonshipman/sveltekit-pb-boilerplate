import { getOne, type PbFilter } from '$lib/pocketbase';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params: { collection, id }, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');
	const requestKey = url.searchParams.get('requestKey') || collection + id;

	const options: PbFilter = { requestKey };
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	const one = await getOne({ ...options, collection, id });

	return json(one);
}
