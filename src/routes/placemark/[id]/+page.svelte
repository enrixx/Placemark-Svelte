<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import type {ChartData, Placemark, WeatherResponse} from '$lib/types/placemark-types';
    import WeatherCharts from '$lib/ui/WeatherCharts.svelte';
    import ImageCarousel from '$lib/ui/ImageCarousel.svelte';
    import * as weatherCharts from '$lib/services/weather-charts';

    let placemark = $state<Placemark | null>(null);
    let weatherData = $state<WeatherResponse | null>(null);

    let pastTempChartData = $state<ChartData | null>(null);
    let futureTempChartData = $state<ChartData | null>(null);

    let pastRainChartData = $state<ChartData | null>(null);
    let futureRainChartData = $state<ChartData | null>(null);

    let windHeatmapDays = $state<string[]>([]);
    let windHeatmapHours = $state<number[]>([]);
    let windHeatmapGrid = $state<Array<Array<number | null>>>([]);
    let windHeatmapUnit = $state<string>('');

    let selectedFile = $state<File | null>(null);
    let isUploading = $state(false);
    let uploadError = $state('');
    let fileInput = $state<HTMLInputElement>();

    const recomputeWindHeatmap = () => {
        if (!weatherData) {
            windHeatmapDays = [];
            windHeatmapHours = [];
            windHeatmapGrid = [];
            windHeatmapUnit = '';
            return;
        }

        const grid = weatherCharts.buildFutureWindHeatmapGrid(weatherData, 7);
        windHeatmapDays = grid?.days ?? [];
        windHeatmapHours = grid?.hours ?? [];
        windHeatmapGrid = grid?.grid ?? [];
        windHeatmapUnit = grid?.unit ?? '';
    };

    const handleFileSelect = (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedFile = target.files[0];
            uploadError = '';
        }
    };

    const uploadImage = async () => {
        if (!selectedFile || !placemark?._id) return;

        isUploading = true;
        uploadError = '';

        try {
            const updatedPlacemark = await placemarkService.uploadImage(placemark._id, selectedFile);
            if (updatedPlacemark) {
                await refreshPlacemark();
                placemark = updatedPlacemark;
                selectedFile = null;
                if (fileInput) {
                    fileInput.value = '';
                }
            } else {
                uploadError = 'Failed to upload image. Please try again.';
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            uploadError = 'Failed to upload image. Please try again.';
        } finally {
            isUploading = false;
        }
    };

    const refreshPlacemark = async () => {
        if (!placemark?._id) return;
        const updated = await placemarkService.getPlacemarkById(placemark._id);
        if (updated) {
            placemark = updated;
        }
    };

    $effect(() => {
        if (weatherData) {
            recomputeWindHeatmap();
        }
    });

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
        const daily = weatherData?.daily;
        if (!daily?.time?.length) return;

        const today = new Date().toISOString().split('T')[0];
        const split = weatherCharts.splitPastFutureIndices(daily.time, today);

        const temps = weatherCharts.buildTemperatureCharts(daily, split);
        pastTempChartData = temps.past;
        futureTempChartData = temps.future;

        const rain = weatherCharts.buildRainCharts(daily, split);
        pastRainChartData = rain.past;
        futureRainChartData = rain.future;

        recomputeWindHeatmap();
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
                    <div class="box">
                        <h1 class="title">{placemark.name}</h1>
                        <p class="subtitle">{placemark.categoryName}</p>
                        <div class="content">
                            <p>{placemark.description}</p>
                            <p><strong>Latitude:</strong> {placemark.latitude}</p>
                            <p><strong>Longitude:</strong> {placemark.longitude}</p>
                        </div>
                    </div>

                    <WeatherCharts
                            {pastTempChartData}
                            {futureTempChartData}
                            {pastRainChartData}
                            {futureRainChartData}
                            {windHeatmapDays}
                            {windHeatmapHours}
                            {windHeatmapGrid}
                            {windHeatmapUnit}
                    />

                    {#if !(pastTempChartData || futureTempChartData || pastRainChartData || futureRainChartData || windHeatmapGrid.length)}
                        <div class="notification is-warning">
                            Weather data not available.
                        </div>
                    {/if}

                {:else}
                    <div class="notification">
                        Loading placemark details...
                    </div>
                {/if}
            </div>

            <div class="column is-one-third">
                {#if placemark}
                    <div class="box">
                        <h2 class="title is-5">Images</h2>

                        <ImageCarousel
                                images={placemark.images || []}
                                placemarkId={placemark._id || ''}
                                onImageDeleted={refreshPlacemark}
                        />

                        <div class="upload-section">
                            <div class="file has-name is-fullwidth">
                                <label class="file-label">
                                    <input
                                            class="file-input"
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/gif"
                                            onchange={handleFileSelect}
                                            bind:this={fileInput}
                                    />
                                    <span class="file-cta">
                                        <span class="file-icon">
                                            <i class="fas fa-upload"></i>
                                        </span>
                                        <span class="file-label">Choose a file…</span>
                                    </span>
                                    <span class="file-name">
                                        {selectedFile ? selectedFile.name : 'No file selected'}
                                    </span>
                                </label>
                            </div>

                            {#if selectedFile}
                                <button
                                        class="button is-primary is-fullwidth mt-3"
                                        onclick={uploadImage}
                                        disabled={isUploading}
                                >
                                    {#if isUploading}
                                        <span class="icon">
                                            <i class="fas fa-spinner fa-pulse"></i>
                                        </span>
                                        <span>Uploading...</span>
                                    {:else}
                                        <span class="icon">
                                            <i class="fas fa-cloud-upload-alt"></i>
                                        </span>
                                        <span>Upload Image</span>
                                    {/if}
                                </button>
                            {/if}

                            {#if uploadError}
                                <div class="notification is-danger is-light mt-3">
                                    {uploadError}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</section>

<style>
    .upload-section {
        margin-top: 1.5rem;
    }
</style>

