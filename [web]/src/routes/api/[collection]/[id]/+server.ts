import { error, json } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export async function GET({ locals, params: { collection, id }, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');

	const options: PbFilter = { requestKey: collection + id };
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	try {
		const data = await locals.pb.collection(collection).getOne(id, options);
		return json(data);
	} catch (e: unknown) {
		if (e instanceof ClientResponseError) {
			throw error(e.response.code || 500, e.response.message);
		}
	}
}
