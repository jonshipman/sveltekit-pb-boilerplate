import { redirect } from '@sveltejs/kit';
import type { LoginBody } from '../auth';

export const actions = {
	async default({ locals, request }) {
		const bodyRaw = Object.fromEntries(await request.formData()) as unknown;
		const body = bodyRaw as LoginBody;

		try {
			await locals.pb.collection('users').authWithPassword(body.email, body.password);
			if (!locals.pb.authStore.model.verified) {
				locals.pb.authStore.clear();

				return { errorMessage: 'Please verify your account' };
			}
		} catch (e: unknown) {
			console.error('Error:', e);
			const catachable = e as Error;
			return { errorMessage: catachable.message };
		}

		redirect(303, '/admin');
	}
};

export function load({ locals }) {
	if (locals.user) redirect(303, '/admin');
}
