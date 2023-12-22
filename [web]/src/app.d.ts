import type { AuthModel } from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: Pocketbase;
			user: AuthModel | undefined;
		}
	}
}

export {};
