<script lang="ts">
    import {invalidateAll} from '$app/navigation';
    import type {Placemark, WeatherResponse} from '$lib/types/placemark-types';
    import PlacemarkDetails from './PlacemarkDetails.svelte';
    import PlacemarkImages from './PlacemarkImages.svelte';
    import PlacemarkWeather from './PlacemarkWeather.svelte';
    import type {PageData} from './$types';

    let { data }: { data: PageData & { weatherError?: string | null } } = $props();

    let placemark = $state<Placemark | null>(null);
    let weatherData = $state<WeatherResponse | null>(null);
    let weatherError = $state<string | null>(null);
    let activeTab = $state<'details' | 'weather'>('details');

    $effect(() => {
        const d = data as any;
        if (d.placemark) {
            placemark = d.placemark;
        }
        if (d.weather) {
            weatherData = d.weather;
        }
        if (d.weatherError) {
            weatherError = d.weatherError;
        }
    });

    async function refreshPlacemark() {
        await invalidateAll();
    }

    function handlePlacemarkUpdate(updated: Placemark) {
        placemark = updated;
    }
</script>

<svelte:head>
    <title>{placemark?.name || 'Placemark'} - PlacemarkCORE</title>
</svelte:head>

<div class="page-container">
    <div class="container">
        <a href="/dashboard" class="back-button">
            <span class="icon">
                <i class="fas fa-arrow-left"></i>
            </span>
            <span>Back to Dashboard</span>
        </a>

        {#if placemark}
            <!-- Hero Section -->
            <div class="hero-section">
                <div class="hero-content">
                    <div class="hero-badge">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>{placemark.categoryName}</span>
                    </div>
                    <h1 class="hero-title">{placemark.name}</h1>
                    <div class="hero-meta">
                        <span class="meta-item">
                            <i class="fas fa-globe"></i>
                            {placemark.latitude.toFixed(4)}, {placemark.longitude.toFixed(4)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-images"></i>
                            {placemark.images?.length || 0} Photos
                        </span>
                    </div>
                </div>
            </div>

            <!-- Images Gallery Section -->
            <div class="gallery-section">
                <PlacemarkImages
                        placemarkId={placemark._id || ''}
                        images={placemark.images || []}
                        user={data.user}
                        onImageChange={refreshPlacemark}
                />
            </div>

            <!-- Tabbed Content Section -->
            <div class="content-section">
                <div class="tabs-container">
                    <button
                            class="tab-button"
                            class:active={activeTab === 'details'}
                            onclick={() => activeTab = 'details'}
                    >
                        <i class="fas fa-info-circle"></i>
                        <span>Details</span>
                    </button>
                    <button
                            class="tab-button"
                            class:active={activeTab === 'weather'}
                            onclick={() => activeTab = 'weather'}
                    >
                        <i class="fas fa-cloud-sun"></i>
                        <span>Weather</span>
                    </button>
                </div>

                <div class="tab-content">
                    {#if activeTab === 'details'}
                        <div class="tab-panel" style="animation: fadeIn 0.3s ease;">
                            <PlacemarkDetails {placemark} user={data.user} onUpdate={handlePlacemarkUpdate}/>
                        </div>
                    {:else}
                        <div class="tab-panel" style="animation: fadeIn 0.3s ease;">
                            <PlacemarkWeather {weatherData} {weatherError}/>
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="loading-container">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading placemark details...</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .page-container {
        min-height: 100vh;
        background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
        padding: 2rem 0 4rem;
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .back-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        color: #667eea;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        margin-bottom: 2rem;
    }

    .back-button:hover {
        background: #667eea;
        color: white;
        border-color: #667eea;
        transform: translateX(-4px);
    }

    /* Hero Section */
    .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 24px;
        padding: 3rem;
        margin-bottom: 2rem;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
        animation: fadeInUp 0.5s ease;
    }

    .hero-content {
        color: white;
    }

    .hero-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .hero-title {
        font-size: 3rem;
        font-weight: 800;
        margin: 0 0 1rem 0;
        line-height: 1.2;
    }

    .hero-meta {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        opacity: 0.95;
    }

    .meta-item i {
        font-size: 1.1rem;
    }

    /* Gallery Section */
    .gallery-section {
        margin-bottom: 2rem;
        animation: fadeInUp 0.6s ease;
    }

    /* Tabbed Content Section */
    .content-section {
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        animation: fadeInUp 0.7s ease;
    }

    .tabs-container {
        display: flex;
        border-bottom: 2px solid #f0f0f0;
        background: #fafafa;
    }

    .tab-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1.5rem;
        background: transparent;
        border: none;
        color: #666;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }

    .tab-button:hover {
        background: #f5f5f5;
        color: #667eea;
    }

    .tab-button.active {
        color: #667eea;
        background: white;
    }

    .tab-button.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .tab-button i {
        font-size: 1.3rem;
    }

    .tab-content {
        padding: 2rem;
        min-height: 400px;
    }

    .tab-panel {
        animation: fadeIn 0.3s ease;
    }

    /* Loading */
    .loading-container {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .loading-spinner {
        font-size: 3rem;
        color: #667eea;
        margin-bottom: 1rem;
    }

    .loading-container p {
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
    @media (max-width: 768px) {
        .page-container {
            padding: 1rem 0 2rem;
        }

        .container {
            padding: 0 1rem;
        }

        .hero-section {
            padding: 2rem;
            border-radius: 16px;
        }

        .hero-title {
            font-size: 2rem;
        }

        .hero-meta {
            gap: 1rem;
        }

        .tab-button {
            padding: 1rem;
            font-size: 1rem;
        }

        .tab-button span {
            display: none;
        }

        .tab-button i {
            font-size: 1.5rem;
        }

        .tab-content {
            padding: 1rem;
        }
    }
</style>

