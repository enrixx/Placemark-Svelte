<script lang="ts">
    import { enhance } from '$app/forms';
    import Message from '$lib/ui/Message.svelte';
    import UserCredentials from '$lib/ui/UserCredentials.svelte';

    let { form } = $props();

    let email = $state('');
    let password = $state('');
    let message = $state('');

    $effect(() => {
        if (form?.message) {
            message = form.message;
        }
    });
</script>

<form class="modern-form" method="POST" use:enhance>
    {#if message}
        <Message {message}/>
    {/if}
    <UserCredentials bind:email bind:password/>
    <button type="submit" class="btn-primary w-full" style="margin-top: 0.5rem;">
        <i class="fas fa-sign-in-alt"></i>
        <span>Log In</span>
    </button>
</form>

<style>
    .modern-form {
        width: 100%;
    }
</style>

