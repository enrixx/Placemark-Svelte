<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {loggedInUser, currentPlacemarks} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import {refreshPlacemarkState, clearPlacemarkState} from '$lib/services/placemark-utils';
    import LeafletMap from '$lib/ui/LeafletMap.svelte';

    const terrainLayerUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

    onMount(async () => {
        try {
            await placemarkService.restoreSession();
        } catch (e) {
            console.log("Error restoring session", e);
        }

        if (!loggedInUser.token) {
            await goto('/login');
            return;
        }

        // Ensure the dashboard doesn't initialize maps with an empty POI list on reload.
        await refreshPlacemarkState();
    });

    function handleLogout() {
        clearPlacemarkState();
        goto('/login');
    }
</script>

<svelte:head>
    <title>Dashboard - PlacemarkCORE</title>
</svelte:head>

<section class="section">
    <div class="container">
        <h1 class="title">Dashboard</h1>

        {#if loggedInUser.token}
            <div class="notification is-success">
                <p class="subtitle">Welcome back, {loggedInUser.firstName} {loggedInUser.lastName}!</p>
                <p>Email: {loggedInUser.email}</p>
                <p>Role: {loggedInUser.role}</p>
            </div>

            <div class="buttons">
                <button class="button is-danger" onclick={handleLogout}>
                    Logout
                </button>
            </div>

            <div class="box">
                <h2 class="title is-4">Your Placemarks</h2>

                {#if currentPlacemarks.loaded}
                    <div class="columns">
                        <div class="column">
                            <LeafletMap placemarks={currentPlacemarks.placemarks} />
                        </div>
                        <div class="column">
                            <LeafletMap placemarks={currentPlacemarks.placemarks} tileLayerUrl={terrainLayerUrl} />
                        </div>
                    </div>
                {:else}
                    <div class="notification">Loading map points...</div>
                {/if}

                {#if currentPlacemarks.placemarks.length > 0}
                    <table class="table is-fullwidth is-striped">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each currentPlacemarks.placemarks as placemark}
                            <tr>
                                <td>{placemark.name}</td>
                                <td>{placemark.categoryName}</td>
                                <td>{placemark.description}</td>
                                <td>
                                    <a href="/placemark/{placemark._id}" class="button is-small is-info">
                                        View Details
                                    </a>
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                {:else}
                    <p>No placemarks found.</p>
                {/if}
            </div>
        {:else}
            <div class="notification">
                Loading...
            </div>
        {/if}
    </div>
</section>
