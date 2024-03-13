import { pbAsAdmin } from './admin';

type UpsertOptions = {
	id: string;
	collection: string;
	created?: string;
	updated?: string;
	data?: unknown;
};

export async function upsert(options: UpsertOptions) {
	const { id, collection, created, updated, data } = options;
	const pb = await pbAsAdmin();

	return pb.send('/collections/upsert', {
		method: 'POST',
		body: JSON.stringify({ collection, id, created, updated, data })
	});
}
