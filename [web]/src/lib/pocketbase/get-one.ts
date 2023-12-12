import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import type { PbFilter, PbRecord } from '.';
import { POCKETBASE_CLIENT } from './client';

export interface getOneOptions extends PbFilter {
	collection: string;
	id: string;
}

export async function getOne<T = PbRecord>(oneOptions: getOneOptions): Promise<T | undefined> {
	const { collection, id, ...options } = oneOptions;

	try {
		const data = (await POCKETBASE_CLIENT.collection(collection).getOne(id, options)) as T;
		return data;
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			throw error(e.response.code || 500, e.response.message);
		}
	}

	return undefined;
}
