import { dev } from '$app/environment';
import { md5 } from './md5';

const CACHE = new Map();

async function buildResponse(
	fetch: typeof window.fetch,
	url: RequestInfo,
	options?: RequestInit | undefined
): Promise<Response> {
	const strpath = url.toString();
	let key = '';

	if (options) {
		key = md5(strpath + JSON.stringify(options));
	} else {
		key = md5(strpath);
	}

	if (CACHE.has(key) && !dev) return CACHE.get(key).clone();

	const response = await fetch(url, options);

	// retry requests with a 429 status.
	if (response.status === 429) {
		const retryAfter = parseInt(response.headers.get('retry-after') ?? '5');

		console.log('Retrying...');

		console.group();
		console.log('Path', strpath);
		console.log('Status', response.status);
		console.log('RetryAfter', retryAfter);
		console.groupEnd();

		await new Promise(function (resolve) {
			setTimeout(resolve, retryAfter * 1000);
		});

		return buildResponse(fetch, url, options);
	}

	const method = (options?.method ?? 'GET').toUpperCase();

	if (response.ok && method === 'GET') {
		// Clone allows reuse.
		CACHE.set(key, response.clone());

		// Prevents stale content living in the server cache forever.
		setTimeout(
			function () {
				if (CACHE.has(key)) CACHE.delete(key);
			},
			25 * 60 * 1000
		);
	}

	return response;
}

export async function doFetch<T>(
	fetch: typeof window.fetch,
	url: RequestInfo,
	options?: RequestInit | undefined
): Promise<T> {
	const response = await buildResponse(fetch, url, options);
	return response.json();
}
