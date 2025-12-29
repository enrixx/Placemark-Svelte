<script lang="ts">
    import {loggedInUser} from "$lib/runes.svelte";
</script>

<svelte:head>
    <title>Welcome to PlacemarkCORE</title>
</svelte:head>

<div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-container">
            <div class="hero-icon-wrapper">
                <div class="hero-icon">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
            </div>
            <h1 class="hero-title">Welcome to PlacemarkCORE</h1>
            <p class="hero-subtitle">
                A modern fullstack application for managing your favorite places with Hapi.js & SvelteKit
            </p>
            <div class="hero-buttons">
                {#if loggedInUser.token}
                    <a href="/dashboard" class="hero-button primary">
                        <i class="fas fa-th-large"></i>
                        <span>Go to Dashboard</span>
                    </a>
                {:else}
                    <a href="/register" class="hero-button primary">
                        <i class="fas fa-user-plus"></i>
                        <span>Get Started</span>
                    </a>
                    <a href="/login" class="hero-button secondary">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Login</span>
                    </a>
                {/if}
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h3 class="feature-title">Placemarks</h3>
                    <p class="feature-description">
                        Create and manage your favorite places with descriptions, coordinates, and photos.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <h3 class="feature-title">Photo Gallery</h3>
                    <p class="feature-description">
                        Upload multiple photos for each placemark with a beautiful gallery interface.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-cloud-sun"></i>
                    </div>
                    <h3 class="feature-title">Weather Data</h3>
                    <p class="feature-description">
                        View detailed weather information and forecasts for your saved locations.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-tags"></i>
                    </div>
                    <h3 class="feature-title">Categories</h3>
                    <p class="feature-description">
                        Organize your placemarks into custom categories for easy navigation and filtering.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-map"></i>
                    </div>
                    <h3 class="feature-title">Interactive Maps</h3>
                    <p class="feature-description">
                        View all your placemarks on interactive street and terrain maps.
                    </p>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3 class="feature-title">Secure & Private</h3>
                    <p class="feature-description">
                        JWT-based authentication ensures your data stays safe and private.
                    </p>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .homepage {
        min-height: calc(100vh - 70px);
    }

    /* Hero Section */
    .hero-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 4rem 2rem;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
    }

    .hero-container {
        max-width: 800px;
        text-align: center;
        position: relative;
        z-index: 1;
        animation: fadeInUp 0.6s ease;
    }

    .hero-icon-wrapper {
        margin-bottom: 2rem;
    }

    .hero-icon {
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        animation: float 3s ease-in-out infinite;
    }

    .hero-icon i {
        font-size: 3rem;
        color: white;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        color: white;
        margin: 0 0 1.5rem 0;
        line-height: 1.2;
        letter-spacing: -1px;
    }

    .hero-subtitle {
        font-size: 1.4rem;
        color: rgba(255, 255, 255, 0.95);
        margin: 0 0 3rem 0;
        line-height: 1.6;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .hero-buttons {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .hero-button {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem 2.5rem;
        font-size: 1.2rem;
        font-weight: 700;
        border-radius: 16px;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .hero-button.primary {
        background: white;
        color: #667eea;
    }

    .hero-button.primary:hover {
        background: #f8f9fa;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
    }

    .hero-button.secondary {
        background: transparent;
        color: white;
        border: 3px solid rgba(255, 255, 255, 0.4);
    }

    .hero-button.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }

    /* Features Section */
    .features-section {
        padding: 5rem 2rem;
        background: var(--bg-secondary);
        transition: background-color 0.3s ease;
    }

    :global([data-theme="dark"]) .features-section {
        background: linear-gradient(to bottom, #1a1a1a 0%, #252525 100%);
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .feature-card {
        background: var(--card-bg);
        border-radius: 20px;
        padding: 2.5rem;
        border: 2px solid var(--border-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    :global([data-theme="dark"]) .feature-card {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .feature-card:hover {
        transform: translateY(-8px);
        border-color: #667eea;
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);
    }

    :global([data-theme="dark"]) .feature-card:hover {
        box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
    }

    .feature-icon {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        transition: transform 0.3s ease;
    }

    .feature-card:hover .feature-icon {
        transform: scale(1.1) rotate(5deg);
    }

    .feature-icon i {
        font-size: 2rem;
        color: white;
    }

    .feature-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1rem 0;
    }

    .feature-description {
        font-size: 1.05rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
    }

    /* Animations */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 1.5rem;
            min-height: 500px;
        }

        .hero-icon {
            width: 80px;
            height: 80px;
        }

        .hero-icon i {
            font-size: 2.5rem;
        }

        .hero-title {
            font-size: 2.5rem;
        }

        .hero-subtitle {
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }

        .hero-buttons {
            flex-direction: column;
            gap: 1rem;
        }

        .hero-button {
            width: 100%;
            justify-content: center;
            padding: 1rem 2rem;
            font-size: 1.1rem;
        }

        .features-section {
            padding: 3rem 1rem;
        }

        .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .feature-card {
            padding: 2rem;
        }
    }
</style>

