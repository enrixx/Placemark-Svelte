import {fail, redirect} from '@sveltejs/kit';
import type {Actions} from './$types';
import {placemarkService} from '$lib/services/placemark-service';

export const actions: Actions = {
    default: async ({request, cookies}) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return fail(400, {email, missing: true});
        }

        const session = await placemarkService.login(email, password);

        if (session) {
            cookies.set('placemark-session', JSON.stringify(session), {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            throw redirect(303, '/dashboard');
        } else {
            return fail(400, {email, incorrect: true, message: 'Invalid credentials'});
        }
    }
};

