import {currentPlacemarks} from "$lib/runes.svelte";
import {placemarkService} from "$lib/services/placemark-service";

export async function refreshPlacemarkState() {
    currentPlacemarks.loaded = false;
    try {
        currentPlacemarks.placemarks = await placemarkService.getPlacemarks();
        currentPlacemarks.loaded = true;
    } catch (error) {
        console.error('refreshPlacemarkState: Error loading placemarks:', error);
        currentPlacemarks.placemarks = [];
        currentPlacemarks.loaded = true;
    }
}

export function clearPlacemarkState() {
    currentPlacemarks.placemarks = [];
    currentPlacemarks.loaded = false;
    placemarkService.clearSession();
}
