import { DATABASE } from '$lib/config.server';
import Pocketbase from 'pocketbase';

export const POCKETBASE_CLIENT = new Pocketbase(DATABASE);
