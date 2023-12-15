import { redirect } from '@sveltejs/kit';
import type { RegistrationBody } from '../auth';

export const actions = {
	async default({ locals, request }) {
		const bodyRaw = Object.fromEntries(await request.formData()) as unknown;
		const body = bodyRaw as RegistrationBody;

		if (body.password !== body.passwordConfirm) return { errorMessage: 'Passwords do not match' };
		if (body.password.length < 8)
			return { errorMessage: 'Password needs to be 8 characters or longer' };

		try {
			await locals.pb.collection('users').create(body);
			await locals.pb.collection('users').requestVerification(body.email);
		} catch (e: unknown) {
			console.error('Error:', e);
			const catachable = e as Error;
			return { errorMessage: catachable.message };
		}

		return {
			message: 'Please check your email inbox and click the link to verify your account'
		};
	}
};

export function load({ locals }) {
	if (locals.user) redirect(303, '/admin');
}
