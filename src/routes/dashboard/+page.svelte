<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import type {Placemark} from '$lib/types/placemark-types';

    let placemarks: Placemark[] = [];

    onMount(async () => {
        await placemarkService.restoreSession();

        if (!loggedInUser.token) {
            goto('/login');
        }
        placemarks = await placemarkService.getPlacemarks();
    });

    function handleLogout() {
        placemarkService.clearSession();
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
                {#if placemarks.length > 0}
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
                        {#each placemarks as placemark}
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
