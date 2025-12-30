<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {browser} from '$app/environment';
    import type {Placemark} from '$lib/types/placemark-types';
    import type * as Leaflet from 'leaflet';

    interface Props {
        placemarks: Placemark[];
        selectedPlacemarkId?: string | null;
        tileLayerUrl?: string;
        onPlacemarkClick?: (id: string) => void;
    }

    let {
        placemarks,
        selectedPlacemarkId = null,
        tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        onPlacemarkClick
    }: Props = $props();

    let L: typeof Leaflet | null = null;
    let mapElement: HTMLDivElement | undefined = $state();
    let map: Leaflet.Map | null = null;
    let markerLayer: Leaflet.LayerGroup | null = null;
    let tileLayer: Leaflet.TileLayer | null = null;
    let markers: Map<string, Leaflet.Marker> = new Map();
    let defaultIcon: Leaflet.Icon | null = null;

    // If selection changes before markers exist (common right after create/refresh),
    // keep a pending focus request and apply it after marker rebuild.
    let pendingFocusId: string | null = $state(null);

    async function initMap() {
        if (!browser || !mapElement || map) return;

        if (!L) {
            const leafletModule = await import('leaflet');
            L = leafletModule.default || (leafletModule as unknown as typeof Leaflet);
            await import('leaflet/dist/leaflet.css');

            defaultIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        }

        map = L.map(mapElement, {
            center: [53.2734, -7.7783],
            zoom: 7,
            zoomControl: true,
            worldCopyJump: true
        });

        updateTileLayer();

        markerLayer = L.layerGroup().addTo(map);
        updateMarkers();
    }

    function updateTileLayer() {
        if (!map || !L) return;

        if (tileLayer) {
            map.removeLayer(tileLayer);
        }

        tileLayer = L.tileLayer(tileLayerUrl, {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    function updateMarkers() {
        if (!map || !markerLayer || !L || !defaultIcon) return;

        markerLayer.clearLayers();
        markers.clear();

        if (placemarks.length === 0) return;

        const bounds = L.latLngBounds([]);

        placemarks.forEach(placemark => {
            if (!placemark._id) return;

            const marker = L!.marker([placemark.latitude, placemark.longitude], {icon: defaultIcon!})
                .bindPopup(`
                    <div class="popup-content">
                        <h3 style="margin: 0 0 8px 0; font-weight: bold;">${placemark.name}</h3>
                        <p style="margin: 0 0 4px 0;"><strong>Category:</strong> ${placemark.categoryName}</p>
                        ${placemark.description ? `<p style="margin: 4px 0;">${placemark.description}</p>` : ''}
                        <a href="/placemark/${placemark._id}" style="color: #3273dc; text-decoration: none;">View Details →</a>
                    </div>
                `, {autoPan: false});

            marker.on('click', () => {
                if (onPlacemarkClick && placemark._id) {
                    onPlacemarkClick(placemark._id);
                }
            });

            markers.set(placemark._id, marker);
            marker.addTo(markerLayer!);
            bounds.extend([placemark.latitude, placemark.longitude]);
        });

        const isSelectedVisible = selectedPlacemarkId && placemarks.some(p => p._id === selectedPlacemarkId);

        if (placemarks.length > 0 && !isSelectedVisible) {
            map.fitBounds(bounds, {padding: [50, 50]});
        }

        const idToFocus = pendingFocusId ?? selectedPlacemarkId;
        if (idToFocus && markers.has(idToFocus)) {
            focusOnPlacemark(idToFocus);
            pendingFocusId = null;
        }
    }

    function focusOnPlacemark(id: string | null) {
        if (!id || !map) return;

        const marker = markers.get(id);
        if (marker) {
            map.flyTo(marker.getLatLng(), 13, {animate: true, duration: 0.8});
            marker.openPopup();
            return;
        }

        // Marker might not exist yet. Wait for it.
        pendingFocusId = id;
    }

    export function resetMapView() {
        if (!map || !L || placemarks.length === 0) return;

        const bounds = L.latLngBounds([]);
        placemarks.forEach(placemark => {
            bounds.extend([placemark.latitude, placemark.longitude]);
        });

        map.fitBounds(bounds, {padding: [50, 50], animate: true});
    }

    $effect(() => {
        if (map) {
            updateTileLayer();
        }
    });

    $effect(() => {
        void placemarks;
        updateMarkers();
        if (selectedPlacemarkId) {
            focusOnPlacemark(selectedPlacemarkId);
        }
    });

    $effect(() => {
        // When selection changes, try focusing; if marker isn't ready yet it will queue.
        void selectedPlacemarkId;
        if (selectedPlacemarkId) {
            focusOnPlacemark(selectedPlacemarkId);
        }
    });

    onMount(() => {
        setTimeout(() => initMap(), 100);
    });

    onDestroy(() => {
        if (map) {
            map.remove();
            map = null;
        }
    });
</script>

{#if browser}
    <div bind:this={mapElement} class="map-container"></div>
{:else}
    <div class="map-container map-placeholder">
        <div class="placeholder-content">
            <span class="icon is-large">
                <i class="fas fa-map fa-3x"></i>
            </span>
            <p>Loading map...</p>
        </div>
    </div>
{/if}

<style>
    .map-container {
        height: 500px;
        width: 100%;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
    }

    .map-placeholder {
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .placeholder-content {
        text-align: center;
        color: #7a7a7a;
    }

    .placeholder-content .icon {
        margin-bottom: 1rem;
    }

    :global(.popup-content) {
        font-family: inherit;
    }

    /* Dark Mode for Leaflet Popups */
    :global(html[data-theme="dark"] .leaflet-popup-content-wrapper),
    :global(html[data-theme="dark"] .leaflet-popup-tip) {
        background-color: var(--card-bg, #2d2d2d) !important;
        color: var(--text-primary, #e0e0e0) !important;
    }

    :global(html[data-theme="dark"] .popup-content h3) {
        color: var(--text-primary, #e0e0e0) !important;
    }

    :global(html[data-theme="dark"] .popup-content p) {
        color: var(--text-secondary, #b0b0b0) !important;
    }

    :global(html[data-theme="dark"] .popup-content strong) {
        color: var(--text-primary, #e0e0e0) !important;
    }

    :global(html[data-theme="dark"] .popup-content a) {
        color: #667eea !important;
    }

    :global(html[data-theme="dark"] .popup-content a:hover) {
        color: #764ba2 !important;
    }
</style>
