<script lang="ts">
    import {apiError, clearApiError} from '$lib/runes.svelte';

    // Auto-dismiss after 10 seconds
    $effect(() => {
        if (apiError.message && apiError.timestamp) {
            const timeout = setTimeout(() => {
                clearApiError();
            }, 10000);

            return () => clearTimeout(timeout);
        }
    });

    const getErrorTitle = (statusCode: number): string => {
        switch (statusCode) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return 'Forbidden';
            case 404:
                return 'Not Found';
            case 500:
                return 'Server Error';
            default:
                return 'Error';
        }
    };
</script>

{#if apiError.message}
    <div class="notification is-danger is-light error-notification">
        <button class="delete" onclick={clearApiError} aria-label="Close error notification"></button>
        <strong>{getErrorTitle(apiError.statusCode)}</strong>
        {#if apiError.statusCode}
            <span class="tag is-danger ml-2">{apiError.statusCode}</span>
        {/if}
        <p class="mt-2">{apiError.message}</p>
    </div>
{/if}

<style>
    .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(450px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        .error-notification {
            left: 10px;
            right: 10px;
            max-width: none;
        }
    }
</style>

