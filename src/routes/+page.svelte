<script lang="ts">
  import { loggedInUser } from "$lib/runes.svelte";
</script>

<svelte:head>
  <title>Welcome to PlacemarkCORE</title>
</svelte:head>

<section class="hero is-primary is-medium">
  <div class="hero-body">
    <div class="container has-text-centered">
      <h1 class="title is-1">
        Welcome to PlacemarkCORE
      </h1>
      <h2 class="subtitle is-3">
        A Fullstack Application with Hapi.js & SvelteKit
      </h2>
      <div class="buttons is-centered mt-5">
        {#if loggedInUser.token}
          <a href="/dashboard" class="button is-light is-large">
            Go to Dashboard
          </a>
        {:else}
          <a href="/register" class="button is-light is-large">
            Get Started
          </a>
          <a href="/login" class="button is-light is-outlined is-large">
            Login
          </a>
        {/if}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="columns is-multiline">
      <div class="column is-4">
        <div class="card">
          <div class="card-content">
            <p class="title is-4">🗺️ Placemarks</p>
            <p class="content">
              Create and manage your favorite places with descriptions and coordinates.
            </p>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="card">
          <div class="card-content">
            <p class="title is-4">📁 Categories</p>
            <p class="content">
              Organize your placemarks into custom categories for easy navigation.
            </p>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="card">
          <div class="card-content">
            <p class="title is-4">🔐 Secure</p>
            <p class="content">
              JWT-based authentication ensures your data stays safe and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

