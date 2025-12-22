<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';
    import type {Placemark} from '$lib/types/placemark-types';
    import Chart from 'svelte-frappe-charts';

    let placemark: Placemark | null = null;
    let weatherData: any = null;
    let pastChartData: any = null;
    let futureChartData: any = null;

    onMount(async () => {
        await placemarkService.restoreSession();

        if (!loggedInUser.token) {
            goto('/login');
            return;
        }

        const placemarkId = page.params.id as string;
        placemark = await placemarkService.getPlacemarkById(placemarkId);
        if (placemark) {
            weatherData = await placemarkService.getWeather(placemarkId);
            if (weatherData && weatherData.daily) {
                const today = new Date().toISOString().split('T')[0];
                const dates = weatherData.daily.time;
                const maxTemps = weatherData.daily.temperature_2m_max;
                const minTemps = weatherData.daily.temperature_2m_min;

                const pastIndices: number[] = [];
                const futureIndices: number[] = [];

                dates.forEach((date: string, index: number) => {
                    if (date < today) {
                        pastIndices.push(index);
                    } else {
                        futureIndices.push(index);
                    }
                });

                const extract = (data: any[], indices: number[]) => indices.map(i => data[i]);

                if (pastIndices.length > 0) {
                    pastChartData = {
                        labels: extract(dates, pastIndices),
                        datasets: [
                            { name: "Max Temp (°C)", values: extract(maxTemps, pastIndices) },
                            { name: "Min Temp (°C)", values: extract(minTemps, pastIndices) }
                        ]
                    };
                }

                if (futureIndices.length > 0) {
                    futureChartData = {
                        labels: extract(dates, futureIndices),
                        datasets: [
                            { name: "Max Temp (°C)", values: extract(maxTemps, futureIndices) },
                            { name: "Min Temp (°C)", values: extract(minTemps, futureIndices) }
                        ]
                    };
                }
            }
        }
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

                    {#if pastChartData || futureChartData}
                        <div class="columns">
                            {#if pastChartData}
                                <div class="column">
                                    <div class="box">
                                        <h2 class="title is-4">Past Weather</h2>
                                        <Chart data={pastChartData} type="line" height={300}/>
                                    </div>
                                </div>
                            {/if}
                            {#if futureChartData}
                                <div class="column">
                                    <div class="box">
                                        <h2 class="title is-4">Future Weather</h2>
                                        <Chart data={futureChartData} type="line" height={300}/>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {:else}
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
