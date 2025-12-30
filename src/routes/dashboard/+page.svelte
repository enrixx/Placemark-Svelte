<script lang="ts">
    import {tick} from 'svelte';
    import {currentPlacemarks, loggedInUser} from '$lib/runes.svelte';
    import CreatePlacemarkForm from '$lib/ui/CreatePlacemarkForm.svelte';
    import PlacemarkFilters from './PlacemarkFilters.svelte';
    import PlacemarkCard from './PlacemarkCard.svelte';
    import InteractiveMap from './InteractiveMap.svelte';
    import type {Placemark} from '$lib/types/placemark-types';
    import type {PageData} from './$types';

    let { data }: { data: PageData } = $props();

    let showCreateForm = $state(false);
    let searchQuery = $state('');
    let selectedCategory = $state('');
    let selectedPlacemarkId = $state<string | null>(null);
    let streetMapRef: any = $state(null);
    let terrainMapRef: any = $state(null);

    $effect(() => {
        if (data.placemarks) {
            currentPlacemarks.placemarks = data.placemarks;
            currentPlacemarks.loaded = true;
        }
    });

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

    function canEditOrDelete(placemark: Placemark) {
        const user = data.user;
        if (!user) return false;
        return user.role === 'admin' || user._id === placemark.userid;
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
        // Manually update local state if needed, or rely on SSR reload
        currentPlacemarks.placemarks = [...currentPlacemarks.placemarks, placemark];
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

<div class="dashboard-page">
    <div class="container">
        <!-- Hero Header -->
        <div class="dashboard-hero">
            <div class="hero-content">
                <div class="hero-icon">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
                <div class="hero-text">
                    <h1 class="hero-title">Dashboard</h1>
                    <p class="hero-subtitle">Manage and explore your placemarks</p>
                </div>
            </div>
            <button class="create-button" onclick={() => showCreateForm = !showCreateForm}>
                <i class="fas {showCreateForm ? 'fa-times' : 'fa-plus'}"></i>
                <span>{showCreateForm ? 'Cancel' : 'Create New'}</span>
            </button>
        </div>

        {#if showCreateForm}
            <div class="create-form-container">
                <div class="form-header">
                    <i class="fas fa-plus-circle"></i>
                    <h2>Create New Placemark</h2>
                </div>
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

                <div class="results-bar">
                    <div class="results-count">
                        <i class="fas fa-map-pin"></i>
                        <span>Showing <strong>{resultCount}</strong> of <strong>{totalCount}</strong> placemarks</span>
                    </div>
                    <button class="reset-button" onclick={resetMapView}>
                        <i class="fas fa-crosshairs"></i>
                        <span>Reset Maps</span>
                    </button>
                </div>

                {#if filteredPlacemarks.length > 0}
                    <div id="maps-container" class="maps-section">
                        <div class="map-card">
                            <div class="map-header">
                                <i class="fas fa-map"></i>
                                <h3>Street Map</h3>
                            </div>
                            <div class="map-content">
                                <InteractiveMap
                                    bind:this={streetMapRef}
                                    placemarks={filteredPlacemarks}
                                    selectedPlacemarkId={selectedPlacemarkId}
                                    tileLayerUrl={streetLayerUrl}
                                    onPlacemarkClick={handleMapPlacemarkClick}
                                />
                            </div>
                        </div>

                        <div class="map-card">
                            <div class="map-header">
                                <i class="fas fa-mountain"></i>
                                <h3>Terrain Map</h3>
                            </div>
                            <div class="map-content">
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

                    <div class="placemarks-section">
                        <div class="section-header">
                            <i class="fas fa-list"></i>
                            <h2>Your Placemarks</h2>
                        </div>
                        <div class="placemarks-grid">
                            {#each filteredPlacemarks as placemark (placemark._id)}
                                <PlacemarkCard
                                    {placemark}
                                    isSelected={selectedPlacemarkId === placemark._id}
                                    canEditOrDelete={canEditOrDelete(placemark)}
                                    onSelect={() => placemark._id && handlePlacemarkSelect(placemark._id)}
                                />
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No placemarks found</h3>
                        <p>No placemarks match your search criteria. Try adjusting your filters.</p>
                    </div>
                {/if}
            {:else}
                <div class="loading-state">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-pulse"></i>
                    </div>
                    <p>Loading your placemarks...</p>
                </div>
            {/if}
        {:else}
            <div class="loading-state">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-pulse"></i>
                </div>
                <p>Loading...</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard-page {
        padding: 2rem 0 4rem;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    /* Hero Header */
    .dashboard-hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 24px;
        padding: 2rem 2.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        animation: fadeInUp 0.5s ease;
    }

    .hero-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        color: white;
    }

    .hero-icon {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }

    .hero-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0;
        line-height: 1;
    }

    .hero-subtitle {
        font-size: 1.1rem;
        opacity: 0.95;
        margin: 0.5rem 0 0 0;
    }

    .create-button {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 2rem;
        background: white;
        color: #667eea;
        border: none;
        border-radius: 16px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .create-button:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .create-button i {
        font-size: 1.25rem;
    }

    /* Create Form */
    .create-form-container {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 2px solid #667eea;
        animation: fadeIn 0.3s ease;
    }

    .form-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        color: #2c3e50;
    }

    .form-header i {
        font-size: 1.5rem;
        color: #667eea;
    }

    .form-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
    }

    /* Results Bar */
    .results-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1.25rem 1.5rem;
        border-radius: 16px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .results-count {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #666;
        font-size: 1rem;
    }

    .results-count i {
        color: #667eea;
        font-size: 1.25rem;
    }

    .results-count strong {
        color: #667eea;
    }

    .reset-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: #f5f5f5;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        color: #666;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .reset-button:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
    }

    /* Maps Section */
    .maps-section {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .map-card {
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 2px solid #f0f0f0;
        transition: all 0.3s ease;
    }

    .map-card:hover {
        border-color: #667eea;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    }

    .map-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-bottom: 2px solid #f0f0f0;
    }

    .map-header i {
        font-size: 1.25rem;
        color: #667eea;
    }

    .map-header h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
    }

    .map-content {
        height: 500px;
        position: relative;
    }

    /* Placemarks Section */
    .placemarks-section {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 3px solid #f0f0f0;
    }

    .section-header i {
        font-size: 1.5rem;
        color: #667eea;
    }

    .section-header h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
    }

    .placemarks-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
        max-height: 800px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .placemarks-grid::-webkit-scrollbar {
        width: 10px;
    }

    .placemarks-grid::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 10px;
    }

    .placemarks-grid::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
    }

    .placemarks-grid::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .empty-state i {
        font-size: 4rem;
        color: #667eea;
        opacity: 0.3;
        margin-bottom: 1.5rem;
    }

    .empty-state h3 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 0.75rem;
    }

    .empty-state p {
        font-size: 1.1rem;
        color: #666;
    }

    /* Loading State */
    .loading-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .loading-spinner {
        font-size: 3rem;
        color: #667eea;
        margin-bottom: 1.5rem;
    }

    .loading-state p {
        font-size: 1.2rem;
        color: #666;
    }

    /* Animations */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .maps-section {
            grid-template-columns: 1fr;
        }

        .placemarks-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
    }

    @media (max-width: 768px) {
        .dashboard-page {
            padding: 1rem 0 2rem;
        }

        .container {
            padding: 0 1rem;
        }

        .dashboard-hero {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.5rem;
            border-radius: 16px;
        }

        .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .hero-title {
            font-size: 2rem;
        }

        .hero-subtitle {
            font-size: 1rem;
        }

        .create-button {
            width: 100%;
            justify-content: center;
        }

        .results-bar {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
        }

        .results-bar button {
            width: 100%;
            justify-content: center;
        }

        .map-content {
            height: 350px;
        }

        .placemarks-grid {
            grid-template-columns: 1fr;
            max-height: none;
        }
    }
</style>

