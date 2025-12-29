<script lang="ts">
    import {goto} from '$app/navigation';
    import {placemarkService} from '$lib/services/placemark-service';
    import Message from '$lib/ui/Message.svelte';
    import RegisterCredentials from '$lib/ui/RegisterCredentials.svelte';

    let firstName = $state('');
    let lastName = $state('');
    let email = $state('');
    let password = $state('');
    let message = $state('');

    async function register() {
        console.log(`attempting to register: ${firstName} ${lastName} with email: ${email}`);

        if (!firstName || !lastName || !email || !password) {
            message = 'Please fill in all fields';
            return;
        }

        if (password.length < 6) {
            message = 'Password must be at least 6 characters long';
            return;
        }

        const success = await placemarkService.signup({firstName, lastName, email, password});

        if (success) {
            // After successful registration, automatically log in
            const session = await placemarkService.login(email, password);

            if (session) {
                goto('/dashboard');
            } else {
                goto('/login');
            }
        } else {
            firstName = '';
            lastName = '';
            email = '';
            password = '';
            message = 'Registration failed. Email may already be registered.';
        }
    }
</script>

<form class="modern-form" onsubmit={(e) => { e.preventDefault(); register(); }}>
    {#if message}
        <Message {message}/>
    {/if}
    <RegisterCredentials bind:firstName bind:lastName bind:email bind:password/>
    <button type="submit" class="submit-button">
        <i class="fas fa-user-plus"></i>
        <span>Create Account</span>
    </button>
</form>

<style>
    .modern-form {
        width: 100%;
    }

    .submit-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        margin-top: 0.5rem;
    }

    .submit-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .submit-button i {
        font-size: 1.25rem;
    }
</style>

