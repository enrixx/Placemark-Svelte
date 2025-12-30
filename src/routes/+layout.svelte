<script lang="ts">
    import '../app.css';
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import {enhance} from '$app/forms';
    import {loggedInUser} from '$lib/runes.svelte';
    import ErrorNotification from '$lib/ui/ErrorNotification.svelte';

    let {children, data} = $props();

    // theme stored via $state so assignments are reactive in this project
    let theme = $state('light');

    $effect(() => {
        if (data.user) {
            loggedInUser.email = data.user.email;
            loggedInUser.firstName = data.user.firstName;
            loggedInUser.lastName = data.user.lastName;
            loggedInUser.token = data.token;
            loggedInUser._id = data.user._id;
            loggedInUser.role = data.user.role;
            loggedInUser.isOAuth = data.user.isOAuth || false;
            import('axios').then(axios => {
                axios.default.defaults.headers.common["Authorization"] = "Bearer " + data.token;
            });
        } else {
            loggedInUser.email = "";
            loggedInUser.firstName = "";
            loggedInUser.lastName = "";
            loggedInUser.token = "";
            loggedInUser._id = "";
            loggedInUser.role = "";
            loggedInUser.isOAuth = false;
            import('axios').then(axios => {
                delete axios.default.defaults.headers.common["Authorization"];
            });
        }
    });

    onMount(async () => {
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
</script>

<ErrorNotification/>

<nav class="modern-navbar" aria-label="main navigation">
    <div class="navbar-container">
        <div class="navbar-brand">
            <a class="brand-link" href="/">
                <div class="brand-icon">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
                <span class="brand-text">PlacemarkCORE</span>
            </a>
        </div>

        <div class="navbar-content">
            <div class="navbar-start">
                {#if data.user}
                    <a class="nav-link" href="/dashboard">
                        <i class="fas fa-th-large"></i>
                        <span>Dashboard</span>
                    </a>
                {/if}
            </div>

            <div class="navbar-end">
                <button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme"
                        aria-pressed={theme === 'dark'}>
					<span class="toggle-track" class:dark={theme === 'dark'}>
						<span class="toggle-icon sun"><i class="fas fa-sun"></i></span>
						<span class="toggle-icon moon"><i class="fas fa-moon"></i></span>
						<span class="toggle-thumb"></span>
					</span>
                </button>

                {#if data.user}
                    <button class="user-badge" onclick={() => goto('/profile')}>
                        <i class="fas fa-user-circle"></i>
                        <span>{data.user.firstName} {data.user.lastName}</span>
                    </button>

                    <form action="/logout" method="POST" use:enhance style="display: inline;">
                        <button class="logout-button" type="submit">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </button>
                    </form>
                {:else}
                    <a class="nav-link" href="/login">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Login</span>
                    </a>
                    <a class="nav-link primary" href="/register">
                        <i class="fas fa-user-plus"></i>
                        <span>Sign Up</span>
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>

<main class="main-content">
    {@render children()}
</main>

<footer class="modern-footer">
    <div class="footer-content">
        <div class="footer-grid">
            <div class="footer-section">
                <div class="footer-brand-section">
                    <div class="footer-logo">
                        <i class="fas fa-map-marked-alt"></i>
                        <strong>PlacemarkCORE</strong>
                    </div>
                    <p class="footer-description">
                        A modern fullstack application for managing your favorite places with powerful features.
                    </p>
                </div>
            </div>

            <div class="footer-section">
                <h4 class="footer-title">Quick Links</h4>
                <ul class="footer-links">
                    <li><a href="/">Home</a></li>
                    {#if data.user}
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/profile">Profile</a></li>
                    {:else}
                        <li><a href="/login">Login</a></li>
                        <li><a href="/register">Sign Up</a></li>
                    {/if}
                </ul>
            </div>

            <div class="footer-section">
                <h4 class="footer-title">Features</h4>
                <ul class="footer-links">
                    <li><span><i class="fas fa-map-marker-alt"></i> Placemarks</span></li>
                    <li><span><i class="fas fa-images"></i> Photo Gallery</span></li>
                    <li><span><i class="fas fa-cloud-sun"></i> Weather Data</span></li>
                    <li><span><i class="fas fa-map"></i> Interactive Maps</span></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4 class="footer-title">Technology</h4>
                <ul class="footer-links">
                    <li><span><i class="fab fa-node-js"></i> Hapi.js API</span></li>
                    <li><span><i class="fab fa-js"></i> SvelteKit Frontend</span></li>
                    <li><span><i class="fas fa-database"></i> MongoDB</span></li>
                    <li><span><i class="fas fa-shield-alt"></i> JWT Auth</span></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="copyright">
                <i class="fas fa-copyright"></i> 2025 PlacemarkCORE by Enrico Hu. All rights reserved.
            </p>
            <div class="footer-social">
                <a href="https://github.com/enrixx" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/enrico-yongjiang-hu-a75787292/" target="_blank"
                   rel="noopener noreferrer" aria-label="LinkedIn">
                    <i class="fab fa-linkedin"></i>
                </a>
            </div>
        </div>
    </div>
</footer>

<style>
    /* Global Dark Mode Variables */
    :global(:root) {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --text-primary: #2c3e50;
        --text-secondary: #666;
        --border-color: #e0e0e0;
        --card-bg: #ffffff;
        --shadow: rgba(0, 0, 0, 0.1);
    }

    :global([data-theme="dark"]) {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #e0e0e0;
        --text-secondary: #b0b0b0;
        --border-color: #404040;
        --card-bg: #2d2d2d;
        --shadow: rgba(0, 0, 0, 0.3);
    }

    :global(body) {
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Dark mode for cards and containers */
    :global([data-theme="dark"]) :global(.box),
    :global([data-theme="dark"]) :global(.card),
    :global([data-theme="dark"]) :global(.images-container),
    :global([data-theme="dark"]) :global(.filters-container),
    :global([data-theme="dark"]) :global(.results-bar),
    :global([data-theme="dark"]) :global(.map-card),
    :global([data-theme="dark"]) :global(.placemarks-section),
    :global([data-theme="dark"]) :global(.placemark-card),
    :global([data-theme="dark"]) :global(.feature-card),
    :global([data-theme="dark"]) :global(.create-form-container),
    :global([data-theme="dark"]) :global(.details-container),
    :global([data-theme="dark"]) :global(.content-section) {
        background: var(--card-bg) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
    }

    /* Dark mode for text */
    :global([data-theme="dark"]) :global(.title),
    :global([data-theme="dark"]) :global(.hero-title),
    :global([data-theme="dark"]) :global(.section-title),
    :global([data-theme="dark"]) :global(.card-title),
    :global([data-theme="dark"]) :global(.feature-title),
    :global([data-theme="dark"]) :global(h1),
    :global([data-theme="dark"]) :global(h2),
    :global([data-theme="dark"]) :global(h3),
    :global([data-theme="dark"]) :global(h4) {
        color: var(--text-primary) !important;
    }

    /* Dark mode for inputs */
    :global([data-theme="dark"]) :global(.input),
    :global([data-theme="dark"]) :global(.textarea),
    :global([data-theme="dark"]) :global(.select select),
    :global([data-theme="dark"]) :global(.field-input),
    :global([data-theme="dark"]) :global(.field-textarea),
    :global([data-theme="dark"]) :global(.modern-input),
    :global([data-theme="dark"]) :global(.modern-select) {
        background: var(--card-bg) !important;
        color: var(--text-primary) !important;
        border-color: var(--border-color) !important;
    }

    /* Dark mode for tabs */
    :global([data-theme="dark"]) :global(.tabs-container) {
        background: #1a1a1a !important;
        border-bottom-color: var(--border-color) !important;
    }

    :global([data-theme="dark"]) :global(.tab-button) {
        color: var(--text-secondary) !important;
    }

    :global([data-theme="dark"]) :global(.tab-button.active) {
        background: var(--card-bg) !important;
        color: #667eea !important;
    }

    /* Dark mode for empty states */
    :global([data-theme="dark"]) :global(.empty-state),
    :global([data-theme="dark"]) :global(.loading-state) {
        background: var(--card-bg) !important;
    }

    /* Global z-index fix for Leaflet maps */
    :global(.leaflet-container) {
        z-index: 1 !important;
    }

    /* Don't override pane z-index - Leaflet manages this internally */
    :global(.leaflet-map-pane) {
        z-index: auto;
    }

    /* Ensure popups appear above markers */
    :global(.leaflet-popup-pane) {
        z-index: 700 !important;
    }

    :global(.leaflet-tooltip-pane) {
        z-index: 650 !important;
    }

    /* Ensure controls are visible but below navbar */
    :global(.leaflet-top),
    :global(.leaflet-bottom) {
        z-index: 400 !important;
    }

    /* Modern Navbar */
    .modern-navbar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .navbar-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 70px;
    }

    .navbar-brand {
        display: flex;
        align-items: center;
    }

    .brand-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: white;
        transition: transform 0.3s ease;
    }

    .brand-link:hover {
        transform: scale(1.05);
    }

    .brand-icon {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }

    .brand-text {
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.5px;
    }

    .navbar-content {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .navbar-start {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .navbar-end {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0 1rem;
        padding: 0.75rem 1.25rem;
        color: white;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.1);
    }

    .nav-link:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
    }

    .nav-link.primary {
        background: white;
        color: #667eea;
    }

    .nav-link.primary:hover {
        background: #f8f9fa;
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
    }

    .user-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: white;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        font-family: inherit;
        font-size: 1rem;
    }

    .user-badge:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
    }

    .logout-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.15);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;
        font-size: 1rem;
        min-width: 140px;
    }

    .logout-button:hover {
        background: rgba(255, 56, 96, 0.9);
        border-color: rgba(255, 56, 96, 0.9);
        transform: translateY(-2px);
    }

    /* Main Content */
    .main-content {
        min-height: calc(100vh - 200px);
        background: var(--bg-secondary);
        transition: background-color 0.3s ease;
    }

    :global([data-theme="dark"]) .main-content {
        background: linear-gradient(to bottom, #1a1a1a 0%, #252525 100%);
    }


    /* Modern Footer */
    .modern-footer {
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        color: white;
        padding: 3rem 0 1rem;
        margin-top: 4rem;
        border-top: 4px solid #667eea;
        transition: background-color 0.3s ease;
    }

    .modern-footer strong {
        color: white;
    }

    :global([data-theme="dark"]) .modern-footer {
        background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
        border-top: 4px solid #764ba2;
    }

    .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 3rem;
        margin-bottom: 3rem;
    }

    .footer-section {
        display: flex;
        flex-direction: column;
    }

    .footer-brand-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .footer-logo i {
        color: #667eea;
        font-size: 2rem;
    }

    .footer-description {
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .footer-title {
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: white;
    }

    .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .footer-links li {
        display: flex;
        align-items: center;
    }

    .footer-links a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    }

    .footer-links a:hover {
        color: #667eea;
        transform: translateX(4px);
    }

    .footer-links span {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .footer-links span i {
        color: #667eea;
        width: 16px;
    }

    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .copyright {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .footer-social {
        display: flex;
        gap: 1rem;
    }

    .footer-social a {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        font-size: 1.2rem;
    }

    .footer-social a:hover {
        background: #667eea;
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    /* Theme Toggle */
    .theme-toggle {
        background: transparent;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .theme-toggle:focus {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
        border-radius: 24px;
    }

    .toggle-track {
        position: relative;
        width: 54px;
        height: 28px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 28px;
        transition: background-color 0.3s ease;
        display: flex;
        align-items: center;
        border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .toggle-track.dark {
        background: rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .toggle-thumb {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 2;
    }

    .toggle-track.dark .toggle-thumb {
        transform: translateX(26px);
    }

    .toggle-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 13px;
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
        left: 4px;
        color: #fbbf24;
    }

    .toggle-icon.moon {
        right: 4px;
        color: #fbbf24;
    }

    .toggle-track:not(.dark) .toggle-icon.moon {
        opacity: 0.4;
    }

    .toggle-track.dark .toggle-icon.sun {
        opacity: 0.4;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }
    }

    @media (max-width: 768px) {
        .navbar-container {
            padding: 0 1rem;
            min-height: 60px;
        }

        .brand-text {
            display: none;
        }

        .brand-icon {
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
        }

        .navbar-content {
            gap: 0.5rem;
            flex: 1;
            justify-content: space-between;
        }

        .navbar-end {
            gap: 0.75rem;
        }

        .nav-link span,
        .logout-button span {
            display: none;
        }

        .nav-link,
        .logout-button {
            padding: 0.5rem;
        }

        .logout-button {
            min-width: auto;
        }

        .nav-link i,
        .logout-button i {
            font-size: 1.25rem;
        }

        .user-badge {
            padding: 0.5rem;
        }

        .user-badge:hover {
            transform: translateY(0);
        }

        .user-badge span {
            display: none;
        }

        .user-badge i {
            font-size: 1.25rem;
        }

        .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }

        .footer-bottom {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
        }
    }
</style>

