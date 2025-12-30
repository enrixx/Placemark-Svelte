import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { placemarkService } from '$lib/services/placemark-service';

export const load: PageServerLoad = async ({ parent, cookies }) => {
    const { user } = await parent();
    if (!user) {
        throw redirect(303, '/login');
    }

    const sessionStr = cookies.get('placemark-session');
    if (!sessionStr) {
        throw redirect(303, '/login');
    }
    const session = JSON.parse(sessionStr);
    const token = session.token;

    try {
        const placemarks = await placemarkService.getPlacemarks(token);
        return {
            placemarks,
            user
        };
    } catch (e: any) {
       if (e.response?.status === 401) {
            cookies.delete('placemark-session', { path: '/' });
            throw redirect(303, '/login');
        }

        return {
            placemarks: [],
            user
        };
    }
};

export const actions: Actions = {
    create: async ({ request, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const categoryName = formData.get('categoryName') as string;
        const description = formData.get('description') as string;
        const latitude = parseFloat(formData.get('latitude') as string);
        const longitude = parseFloat(formData.get('longitude') as string);

        if (!name || !categoryName) {
            return fail(400, { missing: true, message: 'Name and Category are required' });
        }

        const placemark = {
            name,
            categoryName,
            description,
            latitude,
            longitude
        };

        try {
            const createdPlacemark = await placemarkService.createPlacemark(placemark, token);

            if (createdPlacemark) {
                return { success: true, placemark: createdPlacemark };
            } else {
                return fail(500, { message: 'Failed to create placemark' });
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                cookies.delete('placemark-session', { path: '/' });
                throw redirect(303, '/login');
            }
            return fail(error.statusCode || 503, {
                message: error.message || 'Unable to connect to server. Please try again.'
            });
        }
    },

    delete: async ({ request, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { missing: true, message: 'ID is required' });
        }

        try {
            const success = await placemarkService.deletePlacemark(id, token);
            if (success) {
                return { success: true };
            } else {
                return fail(500, { message: 'Failed to delete placemark' });
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                cookies.delete('placemark-session', { path: '/' });
                throw redirect(303, '/login');
            }
            return fail(error.statusCode || 503, {
                message: error.message || 'Unable to connect to server. Please try again.'
            });
        }
    }
};