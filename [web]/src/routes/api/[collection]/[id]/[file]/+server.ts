import { error, json } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

export async function GET({ locals, params: { collection, id, file } }) {
	if (!locals.user) error(403, 'Forbidden');

	try {
		const fileToken = await locals.pb.files.getToken();
		const data = await locals.pb.collection(collection).getOne(id);
		const url = locals.pb.files.getUrl(data, data[file], { token: fileToken });

		return json({ url });
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			error(e.response.code || 500, e.response.message);
		}

		if (e instanceof Error) {
			error(500, e.message);
		}
	}

	return json(undefined);
}
