<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Placemark } from '$lib/types/placemark-types';

    interface Props {
        onSuccess?: (placemark: Placemark) => void;
    }

    let { onSuccess }: Props = $props();

    let name = $state("");
    let categoryName = $state("");
    let description = $state("");
    let latitude = $state(0);
    let longitude = $state(0);
    let errorMessage = $state("");
    let loading = $state(false);
</script>

<form class="modern-form" method="POST" action="?/create" use:enhance={() => {
    loading = true;
    errorMessage = "";
    return async ({ result }) => {
        loading = false;
        if (result.type === 'success') {
            name = "";
            categoryName = "";
            description = "";
            latitude = 0;
            longitude = 0;
            if (onSuccess && result.data?.placemark) {
                onSuccess(result.data.placemark);
            }
        } else if (result.type === 'failure') {
            errorMessage = result.data?.message || "Failed to create placemark";
        }
    };
}}>
    <div class="form-grid">
        <div class="form-field full-width">
            <label class="field-label" for="name">
                <i class="fas fa-map-marker-alt"></i>
                <span>Name</span>
            </label>
            <input
                id="name"
                name="name"
                class="field-input"
                type="text"
                placeholder="Enter placemark name"
                bind:value={name}
                required
            >
        </div>

        <div class="form-field full-width">
            <label class="field-label" for="category">
                <i class="fas fa-tag"></i>
                <span>Category</span>
            </label>
            <input
                id="categoryName"
                name="categoryName"
                class="field-input"
                type="text"
                placeholder="Enter category name"
                bind:value={categoryName}
                required
            >
        </div>

        <div class="form-field full-width">
            <label class="field-label" for="description">
                <i class="fas fa-align-left"></i>
                <span>Description</span>
            </label>
            <textarea
                id="description"
                name="description"
                class="field-textarea"
                placeholder="Enter description"
                bind:value={description}
                rows="3"
            ></textarea>
        </div>

        <div class="form-field">
            <label class="field-label" for="latitude">
                <i class="fas fa-globe"></i>
                <span>Latitude</span>
            </label>
            <input
                id="latitude"
                name="latitude"
                class="field-input no-spinner"
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="Latitude (-90 to 90)"
                bind:value={latitude}
                required
            >
        </div>

        <div class="form-field">
            <label class="field-label" for="longitude">
                <i class="fas fa-globe"></i>
                <span>Longitude</span>
            </label>
            <input
                id="longitude"
                name="longitude"
                class="field-input no-spinner"
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="Longitude (-180 to 180)"
                bind:value={longitude}
                required
            >
        </div>
    </div>

    {#if errorMessage}
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>{errorMessage}</span>
        </div>
    {/if}

    <button class="btn-primary w-full" type="submit">
        <i class="fas fa-plus-circle"></i>
        <span>Create Placemark</span>
    </button>
</form>

<style>
    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .form-field {
        display: flex;
        flex-direction: column;
    }

    .form-field.full-width {
        grid-column: 1 / -1;
    }

    .field-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #495057;
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }

    .field-label i {
        color: #667eea;
        font-size: 0.9rem;
    }

    .field-input,
    .field-textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .field-input:focus,
    .field-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .field-input::placeholder,
    .field-textarea::placeholder {
        color: #999;
    }

    .field-textarea {
        resize: vertical;
        min-height: 80px;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        background: #feecf0;
        border: 2px solid #ff3860;
        border-radius: 12px;
        color: #cc0f35;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }

    .error-message i {
        font-size: 1.25rem;
    }

    /* Hide number input arrows */
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .no-spinner {
        -moz-appearance: textfield;
        appearance: textfield;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .field-input,
        .field-textarea {
            padding: 0.75rem;
            font-size: 0.95rem;
        }
    }
</style>

