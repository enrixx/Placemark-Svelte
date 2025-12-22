import type { ChartData, ChartDataset, WeatherDaily, WeatherResponse } from "$lib/types/placemark-types";

export {};

const buildChart = (labels: string[], series: ChartDataset[]): ChartData | null => {
  const datasets = series.filter((s) => Array.isArray(s.values) && s.values.length > 0);
  return datasets.length > 0 ? { labels, datasets } : null;
};

const extract = <T,>(data: T[] | undefined, indices: number[]): T[] => {
  if (!data) return [];
  return indices.map((i) => data[i]).filter((v): v is T => v !== undefined);
};

export type SplitIndices = {
  past: number[];
  future: number[];
};

export const splitPastFutureIndices = (dates: string[], todayIso: string): SplitIndices => {
  const past: number[] = [];
  const future: number[] = [];

  dates.forEach((date, index) => {
    if (date < todayIso) past.push(index);
    else future.push(index);
  });

  return { past, future };
};

export const buildTemperatureCharts = (daily: WeatherDaily, split: SplitIndices) => {
  const dates = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;

  return {
    past: buildChart(extract(dates, split.past), [
      { name: "Max Temp (°C)", values: extract(maxTemps, split.past) as number[] },
      { name: "Min Temp (°C)", values: extract(minTemps, split.past) as number[] },
    ]),
    future: buildChart(extract(dates, split.future), [
      { name: "Max Temp (°C)", values: extract(maxTemps, split.future) as number[] },
      { name: "Min Temp (°C)", values: extract(minTemps, split.future) as number[] },
    ]),
  };
};

export const buildRainCharts = (daily: WeatherDaily, split: SplitIndices) => {
  const dates = daily.time;
  const precipSum = daily.precipitation_sum;
  const precipProb = daily.precipitation_probability_max;

  return {
    past: buildChart(extract(dates, split.past), [
      { name: "Rain (mm)", values: extract(precipSum, split.past) as number[] },
      { name: "Rain Probability (%)", values: extract(precipProb, split.past) as number[] },
    ]),
    future: buildChart(extract(dates, split.future), [
      { name: "Rain (mm)", values: extract(precipSum, split.future) as number[] },
      { name: "Rain Probability (%)", values: extract(precipProb, split.future) as number[] },
    ]),
  };
};

// --- Wind: Heatmap (windiest hours/days) ---
export type HeatmapPoint = { date: string; value: number };

export type WindHeatmapGrid = {
  days: string[]; // length = 7
  hours: number[]; // length = 24
  grid: Array<Array<number | null>>; // [hourIndex][dayIndex]
  unit: string;
};

const getTodayIso = () => new Date().toISOString().slice(0, 10);

export const buildFutureWindHeatmapGrid = (weather: WeatherResponse, daysCount = 7): WindHeatmapGrid | null => {
  const times = weather.hourly?.time;
  const speeds = weather.hourly?.windspeed_10m;
  if (!times || !speeds || times.length === 0 || speeds.length === 0) return null;

  const todayIso = getTodayIso();

  const daySet = new Set<string>();
  for (const t of times) {
    const d = t.slice(0, 10);
    if (d >= todayIso) daySet.add(d);
  }

  const days = Array.from(daySet).sort().slice(0, daysCount);
  if (days.length === 0) return null;

  const dayIndex = new Map(days.map((d, i) => [d, i] as const));
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const grid: Array<Array<number | null>> = hours.map(() => new Array(days.length).fill(null));

  const n = Math.min(times.length, speeds.length);
  for (let i = 0; i < n; i++) {
    const t = times[i];
    const v = speeds[i];
    if (Number.isNaN(v)) continue;

    const d = t.slice(0, 10);
    const di = dayIndex.get(d);
    if (di === undefined) continue;

    const hh = Number(t.slice(11, 13));
    if (!Number.isFinite(hh) || hh < 0 || hh > 23) continue;

    grid[hh][di] = v;
  }

  const unit = weather.hourly_units?.windspeed_10m ?? weather.daily_units?.windspeed_10m_max ?? "";

  return { days, hours, grid, unit };
};
