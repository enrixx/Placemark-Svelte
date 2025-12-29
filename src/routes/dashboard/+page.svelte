<script lang="ts">
    import {onMount, tick} from 'svelte';
    import {goto} from '$app/navigation';
    import {loggedInUser, currentPlacemarks} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import {refreshPlacemarkState} from '$lib/services/placemark-utils';
    import CreatePlacemarkForm from '$lib/ui/CreatePlacemarkForm.svelte';
    import PlacemarkFilters from './PlacemarkFilters.svelte';
    import PlacemarkCard from './PlacemarkCard.svelte';
    import InteractiveMap from './InteractiveMap.svelte';
    import type {Placemark} from '$lib/types/placemark-types';

    let showCreateForm = $state(false);
    let searchQuery = $state('');
    let selectedCategory = $state('');
    let selectedPlacemarkId = $state<string | null>(null);
    let streetMapRef: any = $state(null);
    let terrainMapRef: any = $state(null);

    const streetLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const terrainLayerUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";

    const categories = $derived(
        Array.from(new Set(currentPlacemarks.placemarks.map(p => p.categoryName))).sort()
    );

    const placemarkNames = $derived(
        currentPlacemarks.placemarks.map(p => p.name).sort()
    );

    const filteredPlacemarks = $derived(
        currentPlacemarks.placemarks.filter(placemark => {
            const matchesSearch = !searchQuery ||
                placemark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                placemark.description?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || placemark.categoryName === selectedCategory;

            return matchesSearch && matchesCategory;
        })
    );

    const resultCount = $derived(filteredPlacemarks.length);
    const totalCount = $derived(currentPlacemarks.placemarks.length);

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

        await refreshPlacemarkState();
    });

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this placemark?")) {
            const success = await placemarkService.deletePlacemark(id);
            if (success) {
                if (selectedPlacemarkId === id) {
                    selectedPlacemarkId = null;
                }
                await refreshPlacemarkState();
            }
        }
    }

    function canEditOrDelete(placemark: Placemark) {
        return loggedInUser.role === 'admin' || loggedInUser._id === placemark.userid;
    }

    function handlePlacemarkSelect(id: string) {
        selectedPlacemarkId = selectedPlacemarkId === id ? null : id;
        if (selectedPlacemarkId) {
            const mapsContainer = document.getElementById('maps-container');
            if (mapsContainer) {
                mapsContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        }
    }

    function handleMapPlacemarkClick(id: string) {
        selectedPlacemarkId = id;
    }

    async function handleCreateSuccess(placemark: Placemark) {
        showCreateForm = false;
        resetFilters();
        await tick();
        if (placemark._id) {
            handlePlacemarkSelect(placemark._id);
        }
    }

    function resetFilters() {
        searchQuery = '';
        selectedCategory = '';
        selectedPlacemarkId = null;
    }

    function resetMapView() {
        if (streetMapRef?.resetMapView) {
            streetMapRef.resetMapView();
        }
        if (terrainMapRef?.resetMapView) {
            terrainMapRef.resetMapView();
        }
        selectedPlacemarkId = null;
    }
</script>

<svelte:head>
    <title>Dashboard - PlacemarkCORE</title>
</svelte:head>

<section class="section">
    <div class="container">
        <div class="level mb-5">
            <div class="level-left">
                <div class="level-item">
                    <div>
                        <h1 class="title is-3">
                            <span class="icon-text">
                                <span class="icon has-text-info">
                                    <i class="fas fa-map-marked-alt"></i>
                                </span>
                                <span>Dashboard</span>
                            </span>
                        </h1>
                        <p class="subtitle is-6 has-text-grey">
                            Manage and explore your placemarks
                        </p>
                    </div>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button class="button is-primary" onclick={() => showCreateForm = !showCreateForm}>
                        <span class="icon">
                            <i class="fas {showCreateForm ? 'fa-times' : 'fa-plus'}"></i>
                        </span>
                        <span>{showCreateForm ? 'Cancel' : 'Create New'}</span>
                    </button>
                </div>
            </div>
        </div>

        {#if showCreateForm}
            <div class="box mb-5 create-form-box">
                <h2 class="title is-5">Create New Placemark</h2>
                <CreatePlacemarkForm onSuccess={handleCreateSuccess} />
            </div>
        {/if}

        {#if loggedInUser.token}
            {#if currentPlacemarks.loaded}
                <PlacemarkFilters
                    {searchQuery}
                    {selectedCategory}
                    {categories}
                    {placemarkNames}
                    onSearchChange={(value) => searchQuery = value}
                    onCategoryChange={(value) => selectedCategory = value}
                    onReset={resetFilters}
                />

                <div class="results-summary mb-4">
                    <div class="level is-mobile">
                        <div class="level-left">
                            <div class="level-item">
                                <span class="tag is-medium is-info is-light">
                                    Showing {resultCount} of {totalCount} placemarks
                                </span>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <button class="button is-small is-light" onclick={resetMapView}>
                                    <span class="icon">
                                        <i class="fas fa-crosshairs"></i>
                                    </span>
                                    <span>Reset Maps</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {#if filteredPlacemarks.length > 0}
                    <div id="maps-container" class="columns is-variable is-3 mb-4">
                        <div class="column is-half">
                            <div class="box map-box">
                                <h2 class="title is-5 mb-4">
                                    <span class="icon-text">
                                        <span class="icon has-text-info">
                                            <i class="fas fa-map"></i>
                                        </span>
                                        <span>Street Map</span>
                                    </span>
                                </h2>
                                <InteractiveMap
                                    bind:this={streetMapRef}
                                    placemarks={filteredPlacemarks}
                                    selectedPlacemarkId={selectedPlacemarkId}
                                    tileLayerUrl={streetLayerUrl}
                                    onPlacemarkClick={handleMapPlacemarkClick}
                                />
                            </div>
                        </div>

                        <div class="column is-half">
                            <div class="box map-box">
                                <h2 class="title is-5 mb-4">
                                    <span class="icon-text">
                                        <span class="icon has-text-success">
                                            <i class="fas fa-mountain"></i>
                                        </span>
                                        <span>Terrain Map</span>
                                    </span>
                                </h2>
                                <InteractiveMap
                                    bind:this={terrainMapRef}
                                    placemarks={filteredPlacemarks}
                                    selectedPlacemarkId={selectedPlacemarkId}
                                    tileLayerUrl={terrainLayerUrl}
                                    onPlacemarkClick={handleMapPlacemarkClick}
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Placemark List Below Maps -->
                    <div class="box placemark-list-box">
                        <h2 class="title is-5 mb-4">
                            <span class="icon-text">
                                <span class="icon has-text-primary">
                                    <i class="fas fa-list"></i>
                                </span>
                                <span>Your Placemarks</span>
                            </span>
                        </h2>
                        <div class="columns is-multiline placemark-grid">
                            {#each filteredPlacemarks as placemark (placemark._id)}
                                <div class="column is-one-third" id="placemark-card-{placemark._id}">
                                    <PlacemarkCard
                                        {placemark}
                                        isSelected={selectedPlacemarkId === placemark._id}
                                        canEditOrDelete={canEditOrDelete(placemark)}
                                        onSelect={() => placemark._id && handlePlacemarkSelect(placemark._id)}
                                        onDelete={() => placemark._id && handleDelete(placemark._id)}
                                    />
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="notification is-warning is-light">
                        <span class="icon-text">
                            <span class="icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </span>
                            <span>No placemarks match your search criteria. Try adjusting your filters.</span>
                        </span>
                    </div>
                {/if}
            {:else}
                <div class="box has-text-centered">
                    <span class="icon is-large has-text-info">
                        <i class="fas fa-spinner fa-pulse fa-3x"></i>
                    </span>
                    <p class="mt-4">Loading your placemarks...</p>
                </div>
            {/if}
        {:else}
            <div class="notification">
                Loading...
            </div>
        {/if}
    </div>
</section>

<style>
    .create-form-box {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-left: 4px solid #3273dc;
    }

    .map-box {
        height: 100%;
        min-height: 500px;
    }

    .placemark-list-box {
        max-height: none;
    }

    .placemark-grid {
        max-height: 600px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .placemark-grid::-webkit-scrollbar {
        width: 8px;
    }

    .placemark-grid::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    .placemark-grid::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }

    .placemark-grid::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .results-summary {
        animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media screen and (max-width: 768px) {
        .map-box {
            min-height: 350px;
        }

        .placemark-grid {
            max-height: none;
        }
    }
</style>

