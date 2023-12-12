import { POCKETBASE_CLIENT } from './client';
import { getList } from './get-list';
import { getOne } from './get-one';

export type * from './get-list';
export type * from './get-one';
export type * from './index.d';

export { POCKETBASE_CLIENT, getList, getOne };
