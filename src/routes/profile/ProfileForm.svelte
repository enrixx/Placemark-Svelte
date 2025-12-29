<script lang="ts">
    import {loggedInUser, setApiError, clearApiError} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';

    let firstName = $state(loggedInUser.firstName);
    let lastName = $state(loggedInUser.lastName);
    let email = $state(loggedInUser.email);
    let currentPassword = $state('');
    let newPassword = $state('');
    let confirmPassword = $state('');
    let loading = $state(false);
    let successMessage = $state('');
    let showPasswordSection = $state(false);

    async function updateProfile() {
        clearApiError();
        successMessage = '';

        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            setApiError('First name, last name, and email are required');
            return;
        }

        if (showPasswordSection) {
            if (!currentPassword) {
                setApiError('Current password is required to change password');
                return;
            }
            if (newPassword && newPassword !== confirmPassword) {
                setApiError('New passwords do not match');
                return;
            }
            if (newPassword && newPassword.length < 6) {
                setApiError('New password must be at least 6 characters');
                return;
            }
        }

        loading = true;

        try {
            const updates: any = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
            };

            // Only include password if user is changing it
            if (showPasswordSection && newPassword) {
                // First verify current password by attempting to login
                const loginCheck = await placemarkService.login(loggedInUser.email, currentPassword);
                if (!loginCheck) {
                    setApiError('Current password is incorrect');
                    loading = false;
                    return;
                }
                updates.password = newPassword;
            }

            const result = await placemarkService.updateUser(loggedInUser._id, updates);

            if (result) {
                successMessage = 'Profile updated successfully!';
                // Reset password fields
                currentPassword = '';
                newPassword = '';
                confirmPassword = '';
                showPasswordSection = false;

                // Clear success message after 3 seconds
                setTimeout(() => {
                    successMessage = '';
                }, 3000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            loading = false;
        }
    }

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
    <form class="modern-form" onsubmit={(e) => { e.preventDefault(); updateProfile(); }}>
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
                        class="toggle-button"
                        onclick={togglePasswordSection}
                >
                    {showPasswordSection ? 'Cancel' : 'Change Password'}
                </button>
            </div>

            {#if showPasswordSection}
                <div class="password-section">
                    <div class="form-group">
                        <label for="currentPassword">
                            <i class="fas fa-key"></i>
                            <span>Current Password</span>
                        </label>
                        <input
                                id="currentPassword"
                                type="password"
                                bind:value={currentPassword}
                                placeholder="Enter current password"
                                required
                        />
                    </div>

                    <div class="form-group">
                        <label for="newPassword">
                            <i class="fas fa-lock"></i>
                            <span>New Password</span>
                        </label>
                        <input
                                id="newPassword"
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

        <button type="submit" class="submit-button" disabled={loading}>
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
        color: var(--primary-color, #3498db);
    }

    .toggle-button {
        padding: 0.75rem 1.25rem;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    }

    .toggle-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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
        border-color: var(--primary-color, #3498db);
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .submit-button {
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .submit-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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

        .toggle-button {
            width: 100%;
        }
    }
</style>

