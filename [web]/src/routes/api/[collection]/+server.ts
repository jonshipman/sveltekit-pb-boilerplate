import { error, json } from '@sveltejs/kit';

export async function GET({ locals, params, url }) {
	if (!locals.user) throw error(403, 'Forbidden');
	const { collection } = params;
	const page = url.searchParams.get('page') || '1';
	const perPage = url.searchParams.get('perPage') || '50';

	const data = await locals.pb.collection(collection).getList(parseInt(page), parseInt(perPage));
	return json(data);
}
