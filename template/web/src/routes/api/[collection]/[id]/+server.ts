import { error, json } from '@sveltejs/kit';
import { ClientResponseError, type RecordOptions } from 'pocketbase';

export async function GET({ locals, params: { collection, id }, url }) {
	if (!locals.user) error(403, 'Forbidden');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');
	const requestKey = url.searchParams.get('requestKey') || collection + id;

	const options: RecordOptions = { requestKey };
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	try {
		const data = await locals.pb.collection(collection).getOne(id, options);
		return json(data);
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			error(e.response.code || 500, e.response.message);
		}
	}

	return json(undefined);
}

export async function DELETE({ locals, params: { collection, id } }) {
	if (!locals.user) error(403, 'Forbidden');

	try {
		const data = await locals.pb.collection(collection).delete(id);
		return json(data);
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			error(e.response.code || 500, e.response.message);
		}
	}

	return json(undefined);
}
