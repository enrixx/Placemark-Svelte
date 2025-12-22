<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';

    let {children} = $props();

    // theme stored via $state so assignments are reactive in this project
    let theme = $state('light');

    onMount(async () => {
        await placemarkService.restoreSession();
        try {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark' || saved === 'light') {
                applyTheme(saved);
            } else {
                applyTheme('light');
            }
        } catch (err) {
            // ignore if localStorage isn't available
        }
    });

    function applyTheme(t: string) {
        const tt: 'light' | 'dark' = t === 'dark' ? 'dark' : 'light';
        theme = tt;
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', tt);
        }
        try {
            localStorage.setItem('theme', tt);
        } catch (err) {
            // ignore localStorage errors
        }
    }

    function toggleTheme() {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
    }

    onMount(() => {
        // expose toggle globally for quick dev/testing if needed
        if (typeof window !== 'undefined') {
            // @ts-ignore
            window.toggleTheme = (mode: any) => {
                if (mode === 'dark' || mode === 'light') applyTheme(mode);
            };
        }
    });

    function handleLogout() {
        placemarkService.clearSession();
        goto('/');
    }
</script>

<nav class="navbar is-primary" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="/">
            <strong>PlacemarkCORE</strong>
        </a>
    </div>

    <div class="navbar-menu">
        <div class="navbar-start">
            {#if loggedInUser.token}
                <a class="navbar-item" href="/dashboard">
                    Dashboard
                </a>
            {/if}
        </div>

        <div class="navbar-end">
            {#if loggedInUser.token}
                <div class="navbar-item">
                    <button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme"
                            aria-pressed={theme === 'dark'}>
						<span class="toggle-track" class:dark={theme === 'dark'}>
							<span class="toggle-icon sun"><i class="fas fa-sun"></i></span>
							<span class="toggle-icon moon"><i class="fas fa-moon"></i></span>
							<span class="toggle-thumb"></span>
						</span>
                    </button>
                </div>

                <div class="navbar-item">
					<span class="tag is-light">
						{loggedInUser.firstName} {loggedInUser.lastName}
					</span>
                </div>
                <div class="navbar-item">
                    <button class="button is-light" onclick={handleLogout}>
                        Logout
                    </button>
                </div>
            {:else}
                <a class="navbar-item" href="/login">
                    Login
                </a>
                <a class="navbar-item" href="/register">
                    Sign Up
                </a>
            {/if}
        </div>
    </div>
</nav>

<main>
    {@render children()}
</main>

<footer class="footer">
    <div class="content has-text-centered">
        <p>
            <strong>PlacemarkCORE</strong> - Fullstack Application with Hapi.js API & SvelteKit Frontend
        </p>
    </div>
</footer>

<style>
    main {
        min-height: calc(100vh - 180px);
    }

    /* Theme toggle styles */
    .theme-toggle {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        margin-right: 0.5rem;
    }

    .theme-toggle:focus {
        outline: none;
    }

    .toggle-track {
        position: relative;
        width: 50px;
        height: 24px;
        background-color: #e5e7eb;
        border-radius: 24px;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
    }

    .toggle-track.dark {
        background-color: #374151;
    }

    .toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.3s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .toggle-track.dark .toggle-thumb {
        transform: translateX(26px);
    }

    .toggle-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 12px;
        z-index: 1;
        pointer-events: none;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }

    .toggle-icon.sun {
        left: 2px;
        color: #f59e0b;
    }

    .toggle-icon.moon {
        right: 2px;
        color: #fbbf24;
    }

    /* Dim the inactive icon */
    .toggle-track:not(.dark) .toggle-icon.moon {
        opacity: 0.4;
    }

    .toggle-track.dark .toggle-icon.sun {
        opacity: 0.4;
    }
</style>
