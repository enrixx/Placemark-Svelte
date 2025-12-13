<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { loggedInUser } from '$lib/runes.svelte';
  import { placemarkService } from '$lib/services/placemark-service';

  onMount(async () => {
    await placemarkService.restoreSession();

    if (!loggedInUser.token) {
      goto('/login');
    }
  });

  function handleLogout() {
    placemarkService.clearSession();
    goto('/login');
  }
</script>

<svelte:head>
  <title>Dashboard - PlacemarkCORE</title>
</svelte:head>

<section class="section">
  <div class="container">
    <h1 class="title">Dashboard</h1>

    {#if loggedInUser.token}
      <div class="notification is-success">
        <p class="subtitle">Welcome back, {loggedInUser.firstName} {loggedInUser.lastName}!</p>
        <p>Email: {loggedInUser.email}</p>
        <p>Role: {loggedInUser.role}</p>
      </div>

      <div class="buttons">
        <button class="button is-danger" onclick={handleLogout}>
          Logout
        </button>
      </div>
    {:else}
      <div class="notification">
        Loading...
      </div>
    {/if}
  </div>
</section>

