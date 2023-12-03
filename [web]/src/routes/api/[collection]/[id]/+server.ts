import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params: { collection, id }, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');

	const options: PbFilter = {};
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	const data = await locals.pb.collection(collection).getOne(id, options);
	return json(data);
}
