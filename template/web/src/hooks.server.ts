import { PUBLIC_DATABASE } from '$env/static/public';
import Pocketbase from 'pocketbase';

const allowedHeaders = ['retry-after', 'content-type' ];

export async function handle({ event, resolve }) {
	event.locals.pb = new Pocketbase(PUBLIC_DATABASE);
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
		event.locals.pb.authStore.exportToCookie({
			secure: event.url.protocol === 'https:',
			httpOnly: false
		})
	);

	return response;
}
