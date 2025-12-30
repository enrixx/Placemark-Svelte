import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies }) => {
        cookies.delete('placemark-session', { path: '/' });
        throw redirect(303, '/');
    }
};