<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import type {ChartData, Placemark, WeatherResponse} from '$lib/types/placemark-types';
    import WeatherCharts from '$lib/ui/WeatherCharts.svelte';
    import * as weatherCharts from '$lib/services/weather-charts';

    let placemark: Placemark | null = null;
    let weatherData: WeatherResponse | null = null;

    let pastTempChartData: ChartData | null = null;
    let futureTempChartData: ChartData | null = null;

    let pastRainChartData: ChartData | null = null;
    let futureRainChartData: ChartData | null = null;

    let windHeatmapDays: string[] = [];
    let windHeatmapHours: number[] = [];
    let windHeatmapGrid: Array<Array<number | null>> = [];
    let windHeatmapUnit: string = '';

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

    $: if (weatherData) recomputeWindHeatmap();

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
            <div class="column">
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
        </div>
    </div>
</section>
