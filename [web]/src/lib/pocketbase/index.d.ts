export interface PbError {
	message?: string;
}

export interface PbRecord extends PbError {
	collectionId: string;
	collectionName: string;
	id: string;
	created: string;
	updated: string;
}

export interface PbFilter {
	fields?: string;
	filter?: string;
	sort?: string;
	expand?: string;
	requestKey: string;
}

export interface User extends PbRecord {
	email: string;
	avatar: string;
	name: string;
}

export interface PbList<T> extends PbError {
	items: T[];
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
}
