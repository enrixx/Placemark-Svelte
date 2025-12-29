<script lang="ts">
    import { placemarkService } from '$lib/services/placemark-service';
    import { refreshPlacemarkState } from '$lib/services/placemark-utils';
    import { apiError } from '$lib/runes.svelte';
    import type { Placemark } from '$lib/types/placemark-types';

    interface Props {
        onSuccess?: (placemark: Placemark) => void;
    }

    let { onSuccess }: Props = $props();

    let name = $state("");
    let categoryName = $state("");
    let description = $state("");
    let latitude = $state(0);
    let longitude = $state(0);
    let errorMessage = $state("");

    async function createPlacemark() {
        errorMessage = "";

        const placemark = {
            name,
            categoryName,
            description,
            latitude,
            longitude
        };

        const result = await placemarkService.createPlacemark(placemark);
        if (result) {
            await refreshPlacemarkState();
            name = "";
            categoryName = "";
            description = "";
            latitude = 0;
            longitude = 0;
            if (onSuccess) {
                onSuccess(result);
            }
        } else {
            errorMessage = apiError.message || "Failed to create placemark";
        }
    }
</script>

<div class="box">
    <h2 class="title is-4">Create New Placemark</h2>
    <form onsubmit={(e) => { e.preventDefault(); createPlacemark(); }}>
        <div class="field">
            <label class="label" for="name">Name</label>
            <div class="control">
                <input id="name" class="input" type="text" placeholder="Enter placemark name" bind:value={name} required>
            </div>
        </div>

        <div class="field">
            <label class="label" for="category">Category</label>
            <div class="control">
                <input id="category" class="input" type="text" placeholder="Enter category name" bind:value={categoryName} required>
            </div>
        </div>

        <div class="field">
            <label class="label" for="description">Description</label>
            <div class="control">
                <textarea id="description" class="textarea" placeholder="Enter description" bind:value={description}></textarea>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label" for="latitude">Latitude</label>
                    <div class="control">
                        <input
                            id="latitude"
                            class="input no-spinner"
                            type="number"
                            step="any"
                            min="-90"
                            max="90"
                            placeholder="Latitude (-90 to 90)"
                            bind:value={latitude}
                            required
                        >
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label class="label" for="longitude">Longitude</label>
                    <div class="control">
                        <input
                            id="longitude"
                            class="input no-spinner"
                            type="number"
                            step="any"
                            min="-180"
                            max="180"
                            placeholder="Longitude (-180 to 180)"
                            bind:value={longitude}
                            required
                        >
                    </div>
                </div>
            </div>
        </div>

        {#if errorMessage}
            <div class="notification is-danger">
                {errorMessage}
            </div>
        {/if}

        <div class="field">
            <div class="control">
                <button class="button is-primary">Create Placemark</button>
            </div>
        </div>
    </form>
</div>

<style>
    /* Hide number input arrows */
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .no-spinner {
        -moz-appearance: textfield; /* Firefox */
        appearance: textfield;
    }
</style>

