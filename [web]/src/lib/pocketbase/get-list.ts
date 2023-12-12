import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import type { PbFilter, PbList, PbRecord } from '.';
import { POCKETBASE_CLIENT } from './client';

export interface getListOptions extends PbFilter {
	collection: string;
	perPage: number;
	page: number;
}

export async function getList<T = PbRecord>(
	listOptions: getListOptions
): Promise<PbList<T> | undefined> {
	const { page, collection, perPage = 50, ...options } = listOptions;

	try {
		const response = (await POCKETBASE_CLIENT.collection(collection).getList(
			page,
			perPage,
			options
		)) as PbList<T>;
		return response;
	} catch (e: unknown) {
		if (e instanceof ClientResponseError && !e.isAbort) {
			throw error(e.response.code || 500, e.response.message);
		}
	}

	return undefined;
}
