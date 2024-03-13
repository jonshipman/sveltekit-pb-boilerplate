import type { ResetPasswordBody } from '../auth';

export const actions = {
	async default({ locals, request }) {
		const bodyRaw = Object.fromEntries(await request.formData()) as unknown;
		const body = bodyRaw as ResetPasswordBody;

		try {
			await locals.pb.collection('users').requestPasswordReset(body.email);
			return { message: 'An email has been sent to reset your password!' };
		} catch (e: unknown) {
			console.error('Error:', e);
			const catachable = e as Error;
			return { errorMessage: catachable.message };
		}
	}
};
