import {fail, redirect} from '@sveltejs/kit';
import type {Actions} from './$types';
import {placemarkService} from '$lib/services/placemark-service';

export const actions: Actions = {
    default: async ({request, cookies}) => {
        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!firstName || !lastName || !email || !password) {
            return fail(400, {missing: true, message: 'Please fill in all fields'});
        }

        const success = await placemarkService.signup({
            firstName,
            lastName,
            email,
            password
        });

        if (success) {
            // Login
            const session = await placemarkService.login(email, password);

            if (session) {
                cookies.set('placemark-session', JSON.stringify(session), {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 7 // 1 week
                });

                throw redirect(303, '/dashboard');
            }
        }

        return fail(400, {message: 'Registration failed. Email may already be registered.'});
    }
};

