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

export interface ResponseErrorOptions extends ErrorOptions {
	cause: Response;
}

export class ResponseError extends Error {
	cause: Response;

	constructor(message: string, options: ResponseErrorOptions) {
		super(message, options);
		this.name = 'ResponseError';
		this.cause = options.cause;
	}
}

export class Status3XX extends ResponseError {
	constructor(message: string, options: ResponseErrorOptions) {
		super(message, options);
		this.name = 'Status3XX';
	}
}

export class Status4XX extends ResponseError {
	constructor(message: string, options: ResponseErrorOptions) {
		super(message, options);
		this.name = 'Status4XX';
	}
}

export class Status5XX extends ResponseError {
	constructor(message: string, options: ResponseErrorOptions) {
		super(message, options);
		this.name = 'Status5XX';
	}
}

export async function doFetch<T>(
	fetch: typeof window.fetch,
	url: RequestInfo,
	options?: RequestInit | undefined
): Promise<T> {
	const response = await buildResponse(fetch, url, options);
	if (response.status > 299) {
		if (response.status < 400) throw new Status3XX(response.statusText, { cause: response });
		if (response.status < 500) throw new Status4XX(response.statusText, { cause: response });
		if (response.status < 600) throw new Status5XX(response.statusText, { cause: response });
	}

	return response.json();
}
