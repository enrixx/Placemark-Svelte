<script lang="ts">
    import Chart from 'svelte-frappe-charts';
    import type {ChartData} from '$lib/types/placemark-types';
    import WindHeatmap from '$lib/ui/WindHeatmap.svelte';

    export let pastTempChartData: ChartData | null = null;
    export let futureTempChartData: ChartData | null = null;

    export let pastRainChartData: ChartData | null = null;
    export let futureRainChartData: ChartData | null = null;

    export let windHeatmapDays: string[] = [];
    export let windHeatmapHours: number[] = [];
    export let windHeatmapGrid: Array<Array<number | null>> = [];
    export let windHeatmapUnit: string = '';
</script>

{#if pastTempChartData || futureTempChartData}
    <div class="columns">
        {#if pastTempChartData}
            <div class="column">
                <div class="box">
                    <h2 class="title is-4">Past Temperature</h2>
                    <Chart data={pastTempChartData} type="line" height={260}/>
                </div>
            </div>
        {/if}
        {#if futureTempChartData}
            <div class="column">
                <div class="box">
                    <h2 class="title is-4">Future Temperature</h2>
                    <Chart data={futureTempChartData} type="line" height={260}/>
                </div>
            </div>
        {/if}
    </div>
{/if}

{#if pastRainChartData || futureRainChartData}
    <div class="columns">
        {#if pastRainChartData}
            <div class="column">
                <div class="box">
                    <h2 class="title is-4">Past Rain</h2>
                    <Chart data={pastRainChartData} type="bar" height={260}/>
                </div>
            </div>
        {/if}
        {#if futureRainChartData}
            <div class="column">
                <div class="box">
                    <h2 class="title is-4">Future Rain</h2>
                    <Chart data={futureRainChartData} type="bar" height={260}/>
                </div>
            </div>
        {/if}
    </div>
{/if}

{#if windHeatmapDays.length && windHeatmapGrid.length}
    <div class="columns">
        <div class="column">
            <div class="box">
                <h2 class="title is-4">Wind Speed Heatmap (Next 7 Days)</h2>
                <WindHeatmap days={windHeatmapDays} hours={windHeatmapHours} grid={windHeatmapGrid} unit={windHeatmapUnit}/>
                <p class="help mt-2">
                    Redder cells = stronger wind.
                </p>
            </div>
        </div>
    </div>
{/if}
