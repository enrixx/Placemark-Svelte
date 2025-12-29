<script lang="ts">
    import type {Placemark} from '$lib/types/placemark-types';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';

    interface Props {
        placemark: Placemark;
        onUpdate?: (updated: Placemark) => void;
    }

    let {placemark, onUpdate}: Props = $props();

    let isEditing = $state(false);
    let editName = $state("");
    let editCategoryName = $state("");
    let editDescription = $state("");
    let editLatitude = $state(0);
    let editLongitude = $state(0);

    function canEditOrDelete(p: Placemark) {
        return loggedInUser.role === 'admin' || loggedInUser._id === p.userid;
    }

    function startEditing() {
        editName = placemark.name;
        editCategoryName = placemark.categoryName;
        editDescription = placemark.description || "";
        editLatitude = placemark.latitude;
        editLongitude = placemark.longitude;
        isEditing = true;
    }

    function cancelEditing() {
        isEditing = false;
    }

    async function savePlacemark() {
        if (!placemark?._id) return;

        const updatedData = {
            name: editName,
            categoryName: editCategoryName,
            description: editDescription,
            latitude: editLatitude,
            longitude: editLongitude
        };

        const updated = await placemarkService.updatePlacemark(placemark._id, updatedData);
        if (updated) {
            isEditing = false;
            onUpdate?.(updated);
        }
    }
</script>

<div class="box">
    {#if isEditing}
        <h2 class="title is-4">Edit Placemark</h2>
        <form onsubmit={(e) => { e.preventDefault(); savePlacemark(); }}>
            <div class="field">
                <label class="label" for="editName">Name</label>
                <div class="control">
                    <input id="editName" class="input" type="text" bind:value={editName} required />
                </div>
            </div>

            <div class="field">
                <label class="label" for="editCategory">Category</label>
                <div class="control">
                    <input id="editCategory" class="input" type="text" bind:value={editCategoryName} required />
                </div>
            </div>

            <div class="field">
                <label class="label" for="editDescription">Description</label>
                <div class="control">
                    <textarea id="editDescription" class="textarea" bind:value={editDescription}></textarea>
                </div>
            </div>

            <div class="columns">
                <div class="column">
                    <div class="field">
                        <label class="label" for="editLat">Latitude</label>
                        <div class="control">
                            <input id="editLat" class="input" type="number" step="any" bind:value={editLatitude} required />
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field">
                        <label class="label" for="editLng">Longitude</label>
                        <div class="control">
                            <input id="editLng" class="input" type="number" step="any" bind:value={editLongitude} required />
                        </div>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button class="button is-primary" type="submit">Save</button>
                <button class="button is-light" type="button" onclick={cancelEditing}>Cancel</button>
            </div>
        </form>
    {:else}
        <div class="level">
            <div class="level-left">
                <div>
                    <h1 class="title">{placemark.name}</h1>
                    <p class="subtitle">{placemark.categoryName}</p>
                </div>
            </div>
            <div class="level-right">
                {#if canEditOrDelete(placemark)}
                    <button class="button is-info" onclick={startEditing}>Edit</button>
                {/if}
            </div>
        </div>

        <div class="content">
            <p>{placemark.description}</p>
            <p><strong>Latitude:</strong> {placemark.latitude}</p>
            <p><strong>Longitude:</strong> {placemark.longitude}</p>
        </div>
    {/if}
</div>

