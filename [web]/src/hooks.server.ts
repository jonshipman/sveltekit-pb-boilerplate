import { DATABASE } from '$lib/config.server';
import Pocketbase from 'pocketbase';

const allowedHeaders = ['retry-after', 'content-type' ];

const POCKETBASE_CLIENT = new Pocketbase(DATABASE);

export async function handle({ event, resolve }) {
	event.locals.pb = POCKETBASE_CLIENT;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = structuredClone(event.locals.pb.authStore.model);
	} else {
		event.locals.user = undefined;
	}

	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => allowedHeaders.includes(name)
	});

	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ secure: event.url.protocol === 'https:' })
	);

	return response;
}
