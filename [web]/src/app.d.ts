declare global {
	interface PbRecord {
		collectionId: string;
		collectionName: string;
		id: string;
		created: string;
		updated: string;
		message?: string;
	}

	interface PbFilter {
		fields?: string;
		filter?: string;
		sort?: string;
		expand?: string;
	}

	interface PbList<T> {
		items: T[];
		page: number;
		perPage: number;
		totalItems: number;
		totalPages: number;
		message?: string;
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
