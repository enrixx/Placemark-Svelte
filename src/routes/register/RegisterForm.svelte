<script lang="ts">
    import { enhance } from '$app/forms';
    import Message from '$lib/ui/Message.svelte';
    import RegisterCredentials from '$lib/ui/RegisterCredentials.svelte';

    let { form } = $props();

    let firstName = $state('');
    let lastName = $state('');
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
    <RegisterCredentials bind:firstName bind:lastName bind:email bind:password/>
    <button type="submit" class="btn-primary w-full" style="margin-top: 0.5rem;">
        <i class="fas fa-user-plus"></i>
        <span>Create Account</span>
    </button>
</form>

<style>
</style>

