<script lang="ts">
    import {goto} from '$app/navigation';
    import {placemarkService} from '$lib/services/placemark-service';
    import Message from '$lib/ui/Message.svelte';
    import UserCredentials from '$lib/ui/UserCredentials.svelte';

    let email = $state('');
    let password = $state('');
    let message = $state('');

    async function login() {
        console.log(`attempting to log in email: ${email} with password: ${password}`);
        let session = await placemarkService.login(email, password);
        if (session) {
            goto('/dashboard');
        } else {
            email = '';
            password = '';
            message = 'Invalid Credentials';
        }
    }
</script>

<form class="modern-form" onsubmit={(e) => { e.preventDefault(); login(); }}>
    {#if message}
        <Message {message}/>
    {/if}
    <UserCredentials bind:email bind:password/>
    <button type="submit" class="submit-button">
        <i class="fas fa-sign-in-alt"></i>
        <span>Log In</span>
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

