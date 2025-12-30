<script lang="ts">
    import LoginForm from "./LoginForm.svelte";

    let {data, form} = $props();
</script>

<svelte:head>
    <title>Login - PlacemarkCORE</title>
</svelte:head>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-icon">
                    <i class="fas fa-sign-in-alt"></i>
                </div>
                <h1 class="auth-title">Welcome Back</h1>
                <p class="auth-subtitle">Sign in to your PlacemarkCORE account</p>
            </div>
            <LoginForm {form}/>
            <div class="auth-footer">
                <p>Don't have an account? <a href="/register" class="auth-link">Sign up</a></p>
            </div>
        </div>
    </div>
</div>

<style>
    .auth-page {
        min-height: calc(100vh - 70px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
    }

    .auth-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.3;
    }

    .auth-container {
        width: 100%;
        max-width: 480px;
        position: relative;
        z-index: 1;
        animation: fadeInUp 0.5s ease;
    }

    .auth-card {
        background: white;
        border-radius: 24px;
        padding: 3rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    :global([data-theme="dark"]) .auth-card {
        background: var(--card-bg);
    }

    .auth-header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    .auth-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }

    .auth-icon i {
        font-size: 2.5rem;
        color: white;
    }

    .auth-title {
        font-size: 2rem;
        font-weight: 800;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
    }

    .auth-subtitle {
        font-size: 1rem;
        color: var(--text-secondary);
        margin: 0;
    }

    .auth-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid var(--border-color);
    }

    .auth-footer p {
        color: var(--text-secondary);
        margin: 0;
    }

    .auth-link {
        color: #667eea;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .auth-link:hover {
        color: #764ba2;
        text-decoration: underline;
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
        .auth-card {
            padding: 2rem;
            border-radius: 20px;
        }

        .auth-icon {
            width: 70px;
            height: 70px;
        }

        .auth-icon i {
            font-size: 2rem;
        }

        .auth-title {
            font-size: 1.75rem;
        }
    }
</style>


