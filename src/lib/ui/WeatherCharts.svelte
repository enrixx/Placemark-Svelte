<script lang="ts">
    import Chart from 'svelte-frappe-charts';
    import type {ChartData} from '$lib/types/placemark-types';
    import WindHeatmap from '$lib/ui/WindHeatmap.svelte';

    interface Props {
        pastTempChartData?: ChartData | null;
        futureTempChartData?: ChartData | null;
        pastRainChartData?: ChartData | null;
        futureRainChartData?: ChartData | null;
        windHeatmapDays?: string[];
        windHeatmapHours?: number[];
        windHeatmapGrid?: Array<Array<number | null>>;
        windHeatmapUnit?: string;
    }

    let {
        pastTempChartData = null,
        futureTempChartData = null,
        pastRainChartData = null,
        futureRainChartData = null,
        windHeatmapDays = [],
        windHeatmapHours = [],
        windHeatmapGrid = [],
        windHeatmapUnit = ''
    }: Props = $props();
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
