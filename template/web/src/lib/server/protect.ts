import { error } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';
import { PUBLIC_DATABASE } from '$env/static/public';

/**
 * Protects a route by authenticating the user using basic authentication.
 *
 * This function extracts the username and password from the Authorization header
 * (assuming Basic authentication is used). It then attempts to authenticate
 * the user with Pocketbase and checks if the user is verified. If any of these
 * steps fail, a 403 Forbidden error is thrown.
 *
 * On successful authentication, a Pocketbase instance with the authenticated user
 * is returned.
 *
 * Used as the first line in a +server function.
 *
 * @param request The incoming HTTP request object.
 * @returns A Promise resolving to a Pocketbase instance if authentication succeeds,
 * otherwise throws a 403 Forbidden error.
 */
export async function protect(request: Request): Promise<Pocketbase> {
	const auth = request.headers.get('authorization');
	if (!auth) error(403, 'Forbidden');

	const base64Auth = auth.replace('Basic ', '');
	let user = '';
	let pass = '';

	try {
		[user, pass] = Buffer.from(base64Auth, 'base64').toString().split(':');
	} catch (e) {
		error(403, 'Forbidden');
	}

	const pb = new Pocketbase(PUBLIC_DATABASE);

	try {
		await pb.collection('users').authWithPassword(user, pass);
		if (!pb.authStore.model?.verified) error(403, 'Forbidden');
		if (!pb.authStore.isValid) error(403, 'Forbidden');
	} catch (e) {
		error(403, 'Forbidden');
	}

	return pb;
}
