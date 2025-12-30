import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { placemarkService } from '$lib/services/placemark-service';

export const load: PageServerLoad = async ({ params, cookies, parent }) => {
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
    const placemarkId = params.id;

    try {
        const placemark = await placemarkService.getPlacemarkById(placemarkId, token);

        let weather = null;
        if (placemark) {
            weather = await placemarkService.getWeather(placemarkId, token);
        }

        return {
            placemark,
            weather,
            user
        };
    } catch (e) {
        console.error('Error fetching placemark:', e);
        throw redirect(303, '/dashboard');
    }
};

export const actions: Actions = {
    uploadImage: async ({ request, params, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;
        const placemarkId = params.id;

        const formData = await request.formData();
        const image = formData.get('image') as File;

        if (!image || image.size === 0) {
            return fail(400, { message: 'No image selected' });
        }

        const updatedPlacemark = await placemarkService.uploadImage(placemarkId, image, token);

        if (updatedPlacemark) {
            return { success: true, placemark: updatedPlacemark };
        } else {
            return fail(500, { message: 'Failed to upload image' });
        }
    },

    deleteImage: async ({ request, params, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;
        const placemarkId = params.id;

        const formData = await request.formData();
        const imageId = formData.get('imageId') as string;

        if (!imageId) {
            return fail(400, { message: 'Image ID is required' });
        }

        const result = await placemarkService.deleteImage(placemarkId, imageId, token);

        if (result) {
            return { success: true };
        } else {
            return fail(500, { message: 'Failed to delete image' });
        }
    },

    updatePlacemark: async ({ request, params, cookies }) => {
        const sessionStr = cookies.get('placemark-session');
        if (!sessionStr) {
            throw redirect(303, '/login');
        }
        const session = JSON.parse(sessionStr);
        const token = session.token;
        const placemarkId = params.id;

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

        const updatedPlacemark = await placemarkService.updatePlacemark(placemarkId, placemark, token);

        if (updatedPlacemark) {
            return { success: true, placemark: updatedPlacemark };
        } else {
            return fail(500, { message: 'Failed to update placemark' });
        }
    }
};

