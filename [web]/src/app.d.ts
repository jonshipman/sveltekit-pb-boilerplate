declare global {
	interface PbRecord {
		collectionId: string;
		collectionName: string;
		id: string;
		created: string;
		updated: string;
	}

	interface PbFilter {
		filter?: string;
		sort?: string;
		expand?: string;
	}

	interface User extends PbRecord {
		email: string;
		avatar: string;
		name: string;
	}


	namespace App {
		interface Locals {
			pb: Pocketbase;
			user: User | undefined;
		}
	}
}

export {};
