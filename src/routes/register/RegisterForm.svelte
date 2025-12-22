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

<div class="box">
    {#if message}
        <Message {message}/>
    {/if}
    <RegisterCredentials bind:firstName bind:lastName bind:email bind:password/>
    <button onclick={() => register()} class="button is-link">Sign Up</button>
</div>

