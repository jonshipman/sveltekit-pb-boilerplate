import { PUBLIC_DATABASE } from '$env/static/public';
import { ADMIN_USER, ADMIN_PASS } from '$env/static/private';
import Pocketbase from 'pocketbase';

/**
 * Pocketbase instance authenticated as an admin using `ADMIN_USER` and `ADMIN_PASS` envvars.
 */
export async function pbAsAdmin() {
	const pb = new Pocketbase(PUBLIC_DATABASE);
	await pb.admins.authWithPassword(ADMIN_USER, ADMIN_PASS);

	if (pb.authStore.isValid) {
		return pb;
	}

	pb.authStore.clear();
	throw new Error('ADMIN_USER/ADMIN_PASS not valid');
}
