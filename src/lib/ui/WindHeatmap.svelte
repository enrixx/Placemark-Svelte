<script lang="ts">
    type WindHeatmapCell = number | null;

    interface Props {
        days?: string[]; // columns (YYYY-MM-DD)
        hours?: number[]; // rows (0..23)
        grid?: WindHeatmapCell[][]; // [hourIndex][dayIndex]
        unit?: string;
    }

    let {
        days = [],
        hours = Array.from({length: 24}, (_, i) => i),
        grid = [],
        unit = ""
    }: Props = $props();

    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));


    const colorFor = (v: WindHeatmapCell) => {
        if (v === null || Number.isNaN(v)) {
            return "#f5f5f5";
        }

        // Determine max scale based on unit
        let maxScale = 60; // Default (km/h)
        const u = (unit || "").toLowerCase();
        if (u.includes("m/s")) maxScale = 20;
        else if (u.includes("mph")) maxScale = 40;
        else if (u.includes("kn")) maxScale = 30;

        // Normalize based on absolute scale
        const t = clamp01(v / maxScale);
        const eased = Math.pow(t, 0.6);

        // Red scale (light -> strong red)
        const r = 255;
        const g = Math.round(245 * (1 - eased));
        const b = Math.round(245 * (1 - eased));
        return `rgb(${r},${g},${b})`;
    };
</script>

<div class="wind-heatmap">
    <div class="wind-heatmap__header">
        <div class="wind-heatmap__spacer"></div>
        {#each days as d}
            <div class="wind-heatmap__day" title={d}>{d.slice(5)}</div>
        {/each}
    </div>

    <div class="wind-heatmap__body">
        {#each hours as h, hi}
            <div class="wind-heatmap__row">
                <div class="wind-heatmap__hour">{String(h).padStart(2, '0')}</div>
                {#each days as _d, di}
                    {@const v = grid?.[hi]?.[di] ?? null}
                    <div
                            class="wind-heatmap__cell"
                            style={`background:${colorFor(v)};`}
                            title={`${days[di]} ${String(h).padStart(2, '0')}:00 — ${v === null ? 'n/a' : v + (unit ? ' ' + unit : '')}`}
                    >
                        {#if typeof v === 'number'}
                            <span class="wind-heatmap__value">{Math.round(v)}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <div class="wind-heatmap__legend">
        <span>Calm</span>
        <div class="wind-heatmap__legend-bar"></div>
        <span>Strong
            {#if unit} ({unit}){/if}</span>
    </div>
</div>

<style>
    .wind-heatmap__header,
    .wind-heatmap__row {
        display: grid;
        grid-template-columns: 30px repeat(var(--days), minmax(24px, 1fr));
        gap: 2px;
        align-items: center;
    }

    .wind-heatmap {
        --days: 7;
    }

    .wind-heatmap__spacer {
        height: 1px;
    }

    .wind-heatmap__day {
        font-size: 0.7rem;
        font-weight: 600;
        text-align: center;
        color: #4a4a4a;
    }

    .wind-heatmap__body {
        margin-top: 5px;
        display: grid;
        gap: 2px;
    }

    .wind-heatmap__hour {
        font-size: 0.7rem;
        font-weight: 600;
        text-align: right;
        padding-right: 4px;
        color: #4a4a4a;
    }

    .wind-heatmap__cell {
        height: 20px;
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.65rem;
        line-height: 1;
        user-select: none;
    }

    .wind-heatmap__value {
        color: rgba(0, 0, 0, 0.7);
        font-weight: 600;
    }

    .wind-heatmap__legend {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.7rem;
        color: #4a4a4a;
    }

    .wind-heatmap__legend-bar {
        flex: 1;
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgb(255, 245, 245), rgb(255, 0, 0));
        border: 1px solid rgba(0, 0, 0, 0.06);
    }

    /* Dark Mode Overrides */
    :global(html[data-theme="dark"]) .wind-heatmap__day,
    :global(html[data-theme="dark"]) .wind-heatmap__hour,
    :global(html[data-theme="dark"]) .wind-heatmap__legend {
        color: #a0aec0;
    }

    :global(html[data-theme="dark"]) .wind-heatmap__cell {
        border-color: rgba(255, 255, 255, 0.1);
    }
</style>
