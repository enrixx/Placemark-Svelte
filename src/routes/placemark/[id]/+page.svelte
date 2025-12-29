<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import type {Placemark, WeatherResponse} from '$lib/types/placemark-types';
    import PlacemarkDetails from './PlacemarkDetails.svelte';
    import PlacemarkImages from './PlacemarkImages.svelte';
    import PlacemarkWeather from './PlacemarkWeather.svelte';

    let placemark = $state<Placemark | null>(null);
    let weatherData = $state<WeatherResponse | null>(null);

    async function refreshPlacemark() {
        if (!placemark?._id) return;
        const updated = await placemarkService.getPlacemarkById(placemark._id);
        if (updated) {
            placemark = updated;
        }
    }

    function handlePlacemarkUpdate(updated: Placemark) {
        placemark = updated;
    }

    onMount(async () => {
        await placemarkService.restoreSession();

        if (!loggedInUser.token) {
            goto('/login');
            return;
        }

        const placemarkId = page.params.id as string;
        placemark = await placemarkService.getPlacemarkById(placemarkId);
        if (!placemark) return;

        weatherData = await placemarkService.getWeather(placemarkId);
    });
</script>

<svelte:head>
    <title>Placemark Details - PlacemarkCORE</title>
</svelte:head>

<section class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-two-thirds">
                <a href="/dashboard" class="button is-link is-light mb-4">Back to Dashboard</a>

                {#if placemark}
                    <PlacemarkDetails {placemark} onUpdate={handlePlacemarkUpdate} />
                    <PlacemarkWeather {weatherData} />
                {:else}
                    <div class="notification">
                        Loading placemark details...
                    </div>
                {/if}
            </div>

            <div class="column is-one-third">
                {#if placemark}
                    <PlacemarkImages
                            placemarkId={placemark._id || ''}
                            images={placemark.images || []}
                            onImageChange={refreshPlacemark}
                    />
                {/if}
            </div>
        </div>
    </div>
</section>

