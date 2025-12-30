import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { placemarkService } from '$lib/services/placemark-service';

export const load: PageServerLoad = async ({ parent }) => {
    const { user } = await parent();
    if (!user) {
        throw redirect(303, '/login');
    }
    return {
        user
    };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;

        if (!firstName || !lastName || !email) {
            return fail(400, { missing: true, message: 'First name, last name, and email are required' });
        }

        const updates: any = {
            firstName,
            lastName,
            email
        };

        if (newPassword) {
            if (!currentPassword) {
                return fail(400, { message: 'Current password is required to change password' });
            }

            // Verify current password
            const loginSession = await placemarkService.login(session.user.email, currentPassword);
            if (!loginSession) {
                 return fail(400, { message: 'Current password is incorrect' });
            }
            updates.password = newPassword;
        }

        const updatedUser = await placemarkService.updateUser(session.user._id, updates, token);

        if (updatedUser) {
            // Update session cookie with new user details
            session.user.firstName = updatedUser.firstName;
            session.user.lastName = updatedUser.lastName;
            session.user.email = updatedUser.email;

            cookies.set('placemark-session', JSON.stringify(session), {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });

            return { success: true, message: 'Profile updated successfully' };
        } else {
            return fail(500, { message: 'Failed to update profile' });
        }
    }
};

