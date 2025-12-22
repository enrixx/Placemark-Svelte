<script lang="ts">
    import { onMount } from 'svelte';
    import type { Placemark } from '$lib/types/placemark-types';
    import { browser } from '$app/environment';
    import 'leaflet/dist/leaflet.css';
    import { mapState, persistMapState, restoreMapState } from '$lib/runes.svelte';

    let { placemarks, tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' } = $props<{ placemarks: Placemark[], tileLayerUrl?: string }>();

    let map: any;
    let mapElement: HTMLElement;
    let L: any;
    let layerControl: any;
    let overlays: { [key: string]: any } = {};
    let isProgrammaticMove = false;
    let hasFitBounds = false;

    onMount(async () => {
        if (browser) {
            // Restore last view so F5 keeps the map position and both maps start aligned.
            restoreMapState();

            L = await import('leaflet');

            map = L.map(mapElement, {
                center: [mapState.location.lat, mapState.location.lng],
                zoom: mapState.zoom,
            });

            L.tileLayer(tileLayerUrl, {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            const publishViewToState = () => {
                if (isProgrammaticMove) {
                    isProgrammaticMove = false;
                    return;
                }
                const center = map.getCenter();
                const zoom = map.getZoom();
                mapState.location = { lat: center.lat, lng: center.lng };
                mapState.zoom = zoom;
                persistMapState();
            };

            map.on('moveend', publishViewToState);
            map.on('zoomend', publishViewToState);

            updateMap();
        }
    });

    $effect(() => {
        if (map && L && placemarks) {
            updateMap();
        }
    });

    // React to shared mapState changes and follow in sync.
    $effect(() => {
        const signature = `${mapState.location.lat},${mapState.location.lng},${mapState.zoom}`;
        if (!map || !L || !signature) return;

        const center = map.getCenter();
        const currentZoom = map.getZoom();
        const dist = center.distanceTo([mapState.location.lat, mapState.location.lng]);

        if (dist > 1 || currentZoom !== mapState.zoom) {
            isProgrammaticMove = true;
            map.setView([mapState.location.lat, mapState.location.lng], mapState.zoom, { animate: false });
        }
    });

    function updateMap() {
        if (!map || !L) return;

        // Remove old overlays
        Object.values(overlays).forEach(layer => map.removeLayer(layer));
        if (layerControl) {
            map.removeControl(layerControl);
        }

        overlays = {};
        const categories: Set<string> = new Set(placemarks.map((p: Placemark) => p.categoryName));

        categories.forEach((category) => {
            overlays[category] = L.layerGroup();
        });

        placemarks.forEach((placemark: Placemark) => {
            if (placemark.latitude && placemark.longitude) {
                const marker = L.marker([placemark.latitude, placemark.longitude]);
                const popupContent = `
                    <b>${placemark.name}</b><br>
                    ${placemark.categoryName}<br>
                    <a href="/placemark/${placemark._id}">View Details</a>
                `;
                marker.bindPopup(popupContent);
                marker.on('click', () => {
                    mapState.location = { lat: placemark.latitude, lng: placemark.longitude };
                    mapState.zoom = 15;
                    mapState.selectedPlacemarkId = placemark._id || "";
                    persistMapState();
                });
                if (overlays[placemark.categoryName]) {
                    marker.addTo(overlays[placemark.categoryName]);
                }
            }
        });

        Object.values(overlays).forEach((layer) => layer.addTo(map));
        layerControl = L.control.layers(undefined, overlays).addTo(map);

        // Auto-fit only once
        if (!hasFitBounds && placemarks.length > 0 && !mapState.selectedPlacemarkId) {
            const valid = placemarks.filter((p: Placemark) => p.latitude && p.longitude);
            if (valid.length > 0) {
                const group = L.featureGroup(valid.map((p: Placemark) => L.marker([p.latitude, p.longitude])));
                hasFitBounds = true;
                map.fitBounds(group.getBounds());
                const center = map.getCenter();
                mapState.location = { lat: center.lat, lng: center.lng };
                mapState.zoom = map.getZoom();
                persistMapState();
            }
        }
    }
</script>

<div bind:this={mapElement} style="height: 600px; width: 100%;"></div>
