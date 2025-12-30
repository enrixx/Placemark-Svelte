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

<div class="weather-container">
    {#if pastTempChartData || futureTempChartData}
        <div class="section-header">
            <i class="fas fa-temperature-high"></i>
            <h3>Temperature</h3>
        </div>
        <div class="charts-grid">
            {#if pastTempChartData}
                <div class="chart-card">
                    <div class="chart-header">
                        <i class="fas fa-history"></i>
                        <h4>Past Week</h4>
                    </div>
                    <div class="chart-content">
                        <Chart data={pastTempChartData} type="line" height={280}/>
                    </div>
                </div>
            {/if}
            {#if futureTempChartData}
                <div class="chart-card">
                    <div class="chart-header">
                        <i class="fas fa-clock"></i>
                        <h4>Forecast</h4>
                    </div>
                    <div class="chart-content">
                        <Chart data={futureTempChartData} type="line" height={280}/>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if pastRainChartData || futureRainChartData}
        <div class="section-header">
            <i class="fas fa-cloud-rain"></i>
            <h3>Precipitation</h3>
        </div>
        <div class="charts-grid">
            {#if pastRainChartData}
                <div class="chart-card">
                    <div class="chart-header">
                        <i class="fas fa-history"></i>
                        <h4>Past Week</h4>
                    </div>
                    <div class="chart-content">
                        <Chart data={pastRainChartData} type="bar" height={280}/>
                    </div>
                </div>
            {/if}
            {#if futureRainChartData}
                <div class="chart-card">
                    <div class="chart-header">
                        <i class="fas fa-clock"></i>
                        <h4>Forecast</h4>
                    </div>
                    <div class="chart-content">
                        <Chart data={futureRainChartData} type="bar" height={280}/>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if windHeatmapDays.length && windHeatmapGrid.length}
        <div class="section-header">
            <i class="fas fa-wind"></i>
            <h3>Wind Speed</h3>
        </div>
        <div class="chart-card full-width">
            <div class="chart-header">
                <i class="fas fa-th"></i>
                <h4>7-Day Wind Heatmap</h4>
            </div>
            <div class="chart-content">
                <WindHeatmap
                        days={windHeatmapDays}
                        hours={windHeatmapHours}
                        grid={windHeatmapGrid}
                        unit={windHeatmapUnit}
                />
                <p class="chart-help">
                    <i class="fas fa-info-circle"></i>
                    Darker colors indicate stronger wind speeds
                </p>
            </div>
        </div>
    {/if}

    {#if !pastTempChartData && !futureTempChartData && !pastRainChartData && !futureRainChartData && !windHeatmapGrid.length}
        <div class="empty-state">
            <i class="fas fa-cloud-sun"></i>
            <h3>No Weather Data Available</h3>
            <p>Weather information could not be loaded for this location</p>
        </div>
    {/if}
</div>

<style>
    .weather-container {
        width: 100%;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        margin-top: 2rem;
    }

    .section-header:first-child {
        margin-top: 0;
    }

    .section-header i {
        font-size: 1.5rem;
        color: #667eea;
    }

    .section-header h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .chart-card {
        background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
        border: 2px solid #f0f0f0;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .chart-card:hover {
        border-color: #667eea;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
    }

    .chart-card.full-width {
        grid-column: 1 / -1;
    }

    .chart-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 1.5rem;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border-bottom: 2px solid #f0f0f0;
    }

    .chart-header i {
        font-size: 1.2rem;
        color: #667eea;
    }

    .chart-header h4 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin: 0;
    }

    .chart-content {
        padding: 1.5rem;
    }

    .chart-help {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        font-size: 0.9rem;
        color: #666;
    }

    .chart-help i {
        color: #667eea;
    }

    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #999;
    }

    .empty-state i {
        font-size: 4rem;
        margin-bottom: 1.5rem;
        opacity: 0.3;
    }

    .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #666;
        margin-bottom: 0.5rem;
    }

    .empty-state p {
        font-size: 1rem;
        color: #999;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .charts-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .section-header {
            margin-top: 1.5rem;
        }

        .section-header h3 {
            font-size: 1.25rem;
        }

        .chart-header {
            padding: 1rem;
        }

        .chart-content {
            padding: 1rem;
        }

        .empty-state {
            padding: 3rem 1rem;
        }

        .empty-state i {
            font-size: 3rem;
        }
    }

    /* Dark Mode Overrides */
    :global(html[data-theme="dark"]) .section-header h3 {
        color: #e2e8f0;
    }

    :global(html[data-theme="dark"]) .chart-card {
        background: linear-gradient(to bottom, #2d3748 0%, #1a202c 100%);
        border-color: #4a5568;
    }

    :global(html[data-theme="dark"]) .chart-card:hover {
        border-color: #667eea;
    }

    :global(html[data-theme="dark"]) .chart-header {
        background: linear-gradient(135deg, #667eea30 0%, #764ba230 100%);
        border-bottom-color: #4a5568;
    }

    :global(html[data-theme="dark"]) .chart-header h4 {
        color: #e2e8f0;
    }

    :global(html[data-theme="dark"]) .chart-help {
        background: #1a202c;
        color: #a0aec0;
    }

    :global(html[data-theme="dark"]) .empty-state h3 {
        color: #a0aec0;
    }

    :global(html[data-theme="dark"]) .empty-state p {
        color: #718096;
    }
</style>
