declare global {
	namespace App {
		interface Locals {
			pb: Pocketbase;
			user: User | undefined;
		}
	}
}

export {};
