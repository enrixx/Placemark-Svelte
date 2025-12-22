import type { Placemark } from "$lib/types/placemark-types";

export const loggedInUser = $state({
    email: "",
    firstName: "",
    lastName: "",
    token: "",
    _id: "",
    role: ""
});

export const subTitle = $state({
    text: ""
});

export const currentPlacemarks = $state({
    placemarks: [] as Placemark[],
    // true once we've attempted to load placemarks for the current session
    loaded: false
});

export const mapState = $state({
    location: { lat: 49.0134, lng: 12.1016 },
    zoom: 12,
    selectedPlacemarkId: ""
});

// Persist/restore map view so multiple maps stay in sync
const MAP_STATE_STORAGE_KEY = "placemark.mapState";

export function restoreMapState() {
    try {
        if (typeof localStorage === "undefined") return;
        const raw = localStorage.getItem(MAP_STATE_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (
            parsed &&
            parsed.location &&
            typeof parsed.location.lat === "number" &&
            typeof parsed.location.lng === "number" &&
            typeof parsed.zoom === "number"
        ) {
            mapState.location = { lat: parsed.location.lat, lng: parsed.location.lng };
            mapState.zoom = parsed.zoom;
            mapState.selectedPlacemarkId = typeof parsed.selectedPlacemarkId === "string" ? parsed.selectedPlacemarkId : "";
        }
    } catch {
        // ignore malformed storage
    }
}

export function persistMapState() {
    try {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(
            MAP_STATE_STORAGE_KEY,
            JSON.stringify({
                location: mapState.location,
                zoom: mapState.zoom,
                selectedPlacemarkId: mapState.selectedPlacemarkId
            })
        );
    } catch {
        // ignore quota / private mode
    }
}
