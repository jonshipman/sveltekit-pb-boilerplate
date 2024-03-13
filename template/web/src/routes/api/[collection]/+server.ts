import { error, json } from '@sveltejs/kit';
import { ClientResponseError, type ListOptions } from 'pocketbase';

export async function GET({ locals, params: { collection }, url }) {
	if (!locals.user) error(403, 'Forbidden');
	const page = url.searchParams.get('page') || '1';
	const perPage = url.searchParams.get('perPage') || '50';
	const sort = url.searchParams.get('sort') || '-created,id';
	const filter = url.searchParams.get('filter');
	const expand = url.searchParams.get('expand');
	const fields = url.searchParams.get('fields');
	const requestKey = url.searchParams.get('requestKey') || `${collection}List`;

	const options: ListOptions = { sort, requestKey };
	if (filter) options.filter = filter;
	if (expand) options.expand = expand;
	if (fields) options.fields = fields;

	try {
		const data = await locals.pb
			.collection(collection)
			.getList(parseInt(page), parseInt(perPage), options);
		return json(data);
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			error(e.response.code || 500, e.response.message);
		}
	}

	return json(undefined);
}

export async function POST({ locals, params: { collection }, request }) {
	if (!locals.user) error(403, 'Forbidden');
	const body = await request.json();

	try {
		const data = await locals.pb.collection(collection).create(body);
		return json(data);
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			error(e.response.code || 500, e.response.message);
		}
	}

	return json(undefined);
}
