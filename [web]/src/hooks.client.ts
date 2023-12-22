import { pb } from '$lib/pocketbase/client';

pb.authStore.loadFromCookie(document.cookie);
