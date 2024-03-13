import { PUBLIC_DATABASE } from '$env/static/public';
import Pocketbase from 'pocketbase';

export const pb = new Pocketbase(PUBLIC_DATABASE);
