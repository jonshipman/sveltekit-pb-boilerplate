import { PUBLIC_DATABASE } from '$env/static/public';
import { ADMIN_USER, ADMIN_PASS } from '$env/static/private';
import Pocketbase from 'pocketbase';

let PCKBS: Pocketbase | undefined = undefined;
let PB_EXPIRES = Date.now();

/**
 * Pocketbase instance authenticated as an admin using `ADMIN_USER` and `ADMIN_PASS` envvars.
 */
export async function pbAsAdmin() {
	if (PCKBS && PB_EXPIRES > Date.now() && PCKBS.authStore.isValid) return PCKBS;

	const pb = new Pocketbase(PUBLIC_DATABASE);
	await pb.admins.authWithPassword(ADMIN_USER, ADMIN_PASS);

	if (pb.authStore.isValid) {
		PCKBS = pb;
		PB_EXPIRES = Date.now() + 3600;
		return pb;
	}

	pb.authStore.clear();
	if (PCKBS) PCKBS.authStore.clear();

	throw new Error('ADMIN_USER/ADMIN_PASS not valid');
}
