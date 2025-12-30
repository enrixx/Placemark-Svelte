<script lang="ts">
    import ProfileForm from './ProfileForm.svelte';

    let {data, form} = $props();
</script>

<div class="profile-page">
    <div class="container">
        <!-- Hero Header -->
        <div class="profile-hero">
            <div class="hero-content">
                <div class="hero-icon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="hero-text">
                    <h1 class="hero-title">My Profile</h1>
                    <p class="hero-subtitle">Manage your account settings and personal information</p>
                </div>
            </div>
        </div>

        <ProfileForm user={data.user} {form} />
    </div>
</div>

<style>
    .profile-page {
        min-height: calc(100vh - 80px);
        padding: 2rem 1rem;
        background: var(--bg-secondary);
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .profile-hero {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        padding: 3rem;
        margin-bottom: 2rem;
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
        animation: fadeInUp 0.6s ease;
    }

    .hero-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .hero-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: white;
        flex-shrink: 0;
    }

    .hero-text {
        flex: 1;
    }

    .hero-title {
        font-size: 2.5rem;
        color: white;
        margin: 0 0 0.5rem 0;
        font-weight: 700;
    }

    .hero-subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
    }

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

    @media (max-width: 768px) {
        .profile-page {
            padding: 1rem 0.5rem;
        }

        .container {
            padding: 0 0.5rem;
        }

        .profile-hero {
            padding: 2rem 1.5rem;
        }

        .hero-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .hero-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
        }

        .hero-title {
            font-size: 2rem;
        }

        .hero-subtitle {
            font-size: 1rem;
        }
    }
</style>

