<script lang="ts">
    import type {ChartData, WeatherResponse} from '$lib/types/placemark-types';
    import * as weatherCharts from '$lib/services/weather-charts';
    import WeatherCharts from '$lib/ui/WeatherCharts.svelte';

    interface Props {
        weatherData: WeatherResponse | null;
    }

    let {weatherData}: Props = $props();

    let pastTempChartData = $state<ChartData | null>(null);
    let futureTempChartData = $state<ChartData | null>(null);
    let pastRainChartData = $state<ChartData | null>(null);
    let futureRainChartData = $state<ChartData | null>(null);
    let windHeatmapDays = $state<string[]>([]);
    let windHeatmapHours = $state<number[]>([]);
    let windHeatmapGrid = $state<Array<Array<number | null>>>([]);
    let windHeatmapUnit = $state<string>('');

    function recomputeWindHeatmap() {
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
    }

    function processWeatherData() {
        if (!weatherData) return;

        const daily = weatherData.daily;
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
    }

    $effect(() => {
        processWeatherData();
    });

    const hasWeatherData = $derived(
        pastTempChartData || futureTempChartData ||
        pastRainChartData || futureRainChartData ||
        windHeatmapGrid.length > 0
    );
</script>

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

{#if !hasWeatherData}
    <div class="notification is-warning">
        Weather data not available.
    </div>
{/if}

