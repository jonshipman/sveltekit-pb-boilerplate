import { redirect } from '@sveltejs/kit';

export function GET({ locals }) {
	locals.pb.authStore.clear();
	locals.user = undefined;

	throw redirect(303, '/');
}
