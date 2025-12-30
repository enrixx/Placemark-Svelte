<script lang="ts">
    import { enhance } from '$app/forms';
    import type {User} from '$lib/types/placemark-types';

    let { user, form } = $props<{ user: User, form: any }>();

    let firstName = $state('');
    let lastName = $state('');
    let email = $state('');
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');
    let loading = $state(false);
    let successMessage = $state('');
    let errorMessage = $state('');
    let showPasswordSection = $state(false);

    // Update form fields when user data changes
    $effect(() => {
        firstName = user.firstName;
        lastName = user.lastName;
        email = user.email;
    });

    $effect(() => {
        if (form?.success) {
            successMessage = form.message;
            currentPassword = '';
            newPassword = '';
            confirmPassword = '';
            showPasswordSection = false;
            setTimeout(() => {
                successMessage = '';
            }, 3000);
        } else if (form?.message) {
            errorMessage = form.message;
        }
    });

    function togglePasswordSection() {
        showPasswordSection = !showPasswordSection;
        if (!showPasswordSection) {
            currentPassword = '';
            newPassword = '';
            confirmPassword = '';
        }
    }
</script>

<div class="profile-form-card">
    <form class="modern-form" method="POST" use:enhance={({ cancel }) => {
        if (showPasswordSection && newPassword && newPassword !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            cancel();
            return;
        }
        loading = true;
        errorMessage = '';
        successMessage = '';
        return async ({ update }) => {
            loading = false;
            await update();
        };
    }}>
        <div class="form-section">
            <h2 class="section-title">
                <i class="fas fa-user"></i>
                Personal Information
            </h2>

            <div class="form-group">
                <label for="firstName">
                    <i class="fas fa-user"></i>
                    <span>First Name</span>
                </label>
                <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        bind:value={firstName}
                        placeholder="Enter your first name"
                        required
                />
            </div>

            <div class="form-group">
                <label for="lastName">
                    <i class="fas fa-user"></i>
                    <span>Last Name</span>
                </label>
                <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        bind:value={lastName}
                        placeholder="Enter your last name"
                        required
                />
            </div>

            <div class="form-group">
                <label for="email">
                    <i class="fas fa-envelope"></i>
                    <span>Email</span>
                </label>
                <input
                        id="email"
                        name="email"
                        type="email"
                        bind:value={email}
                        placeholder="Enter your email"
                        required
                />
            </div>
        </div>

        <div class="form-section">
            <div class="section-header">
                <h2 class="section-title">
                    <i class="fas fa-lock"></i>
                    Change Password
                </h2>
                <button
                        type="button"
                        class="btn-primary-sm"
                        onclick={togglePasswordSection}
                >
                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                </button>
            </div>

            {#if showPasswordSection}
                <div class="password-section">
                    {#if user.isOAuth}
                        <div class="info-message">
                            <i class="fas fa-info-circle"></i>
                            <span>You signed in with GitHub. Set a password to enable email/password login.</span>
                        </div>
                    {/if}

                    {#if !user.isOAuth}
                        <div class="form-group">
                            <label for="currentPassword">
                                <i class="fas fa-key"></i>
                                <span>Current Password</span>
                            </label>
                            <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    bind:value={currentPassword}
                                    placeholder="Enter current password"
                                    required
                            />
                        </div>
                    {/if}

                    <div class="form-group">
                        <label for="newPassword">
                            <i class="fas fa-lock"></i>
                            <span>New Password</span>
                        </label>
                        <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                bind:value={newPassword}
                                placeholder="Enter new password"
                                required
                        />
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">
                            <i class="fas fa-lock"></i>
                            <span>Confirm New Password</span>
                        </label>
                        <input
                                id="confirmPassword"
                                type="password"
                                bind:value={confirmPassword}
                                placeholder="Confirm new password"
                                required
                        />
                    </div>
                </div>
            {/if}
        </div>

        {#if successMessage}
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                {successMessage}
            </div>
        {/if}

        {#if errorMessage}
             <div class="error-message" style="color: red; padding: 1rem; background: #ffebee; border-radius: 8px;">
                <i class="fas fa-exclamation-circle"></i>
                {errorMessage}
            </div>
        {/if}

        <button type="submit" class="btn-primary w-full" disabled={loading} style="margin-top: 1rem;">
            {#if loading}
                <i class="fas fa-spinner fa-spin"></i>
                Updating...
            {:else}
                <i class="fas fa-save"></i>
                Save Changes
            {/if}
        </button>
    </form>
</div>

<style>
    .profile-form-card {
        background: var(--card-bg);
        border-radius: 16px;
        box-shadow: 0 4px 24px var(--shadow);
        padding: 2.5rem;
        animation: fadeInUp 0.6s ease;
        max-width: 800px;
        margin: 0 auto;
    }

    .modern-form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
    }

    .form-section:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .section-title {
        font-size: 1.4rem;
        color: var(--text-primary);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
    }

    .section-title i {
        color: var(--primary-color);
    }

    .password-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        animation: slideDown 0.3s ease;
        padding: 1rem;
        background: var(--bg-secondary);
        border-radius: 12px;
        margin-top: 1rem;
    }

    .info-message {
        padding: 1rem;
        background: var(--primary-gradient);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .info-message i {
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
    }

    .form-group label i {
        color: #667eea;
        font-size: 0.9rem;
    }

    .form-group input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 10px;
        font-size: 1rem;
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: all 0.3s ease;
    }

    .form-group input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .success-message {
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    }

    .success-message i {
        font-size: 1.2rem;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .profile-form-card {
            padding: 1.5rem;
        }

        .section-title {
            font-size: 1.2rem;
        }

        .section-header {
            flex-direction: column;
            align-items: flex-start;
        }

        .btn-primary-sm {
            width: 100%;
        }
    }
</style>

