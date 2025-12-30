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
    <div class="divider">OR</div>
    <a href="/login/github" class="btn-github w-full" style="text-align: center; display: block; text-decoration: none; margin-top: 0.5rem;">
        <i class="fab fa-github"></i>
        <span>Log In with GitHub</span>
    </a>
</form>

<style>
    .divider {
        display: flex;
        align-items: center;
        text-align: center;
        margin: 1rem 0;
        color: #666;
    }
    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ddd;
    }
    .divider::before {
        margin-right: .5em;
    }
    .divider::after {
        margin-left: .5em;
    }
    .btn-github {
        background-color: #333;
        color: white;
        padding: 0.75rem;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    .btn-github:hover {
        background-color: #24292e;
    }
</style>

