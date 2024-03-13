import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	try {
		await locals.pb.collection('users').authRefresh();
	} catch (e) {
		locals.pb.authStore.clear();
		redirect(302, '/' + url.search);
	}

	if (!locals.user || !locals.pb.authStore.isValid) redirect(302, '/' + url.search);
}
