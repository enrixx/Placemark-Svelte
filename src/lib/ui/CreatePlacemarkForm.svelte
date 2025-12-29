<script lang="ts">
    import { placemarkService } from '$lib/services/placemark-service';
    import { refreshPlacemarkState } from '$lib/services/placemark-utils';
    import { apiError } from '$lib/runes.svelte';
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

    async function createPlacemark() {
        errorMessage = "";

        const placemark = {
            name,
            categoryName,
            description,
            latitude,
            longitude
        };

        const result = await placemarkService.createPlacemark(placemark);
        if (result) {
            await refreshPlacemarkState();
            name = "";
            categoryName = "";
            description = "";
            latitude = 0;
            longitude = 0;
            if (onSuccess) {
                onSuccess(result);
            }
        } else {
            errorMessage = apiError.message || "Failed to create placemark";
        }
    }
</script>

<form class="modern-form" onsubmit={(e) => { e.preventDefault(); createPlacemark(); }}>
    <div class="form-grid">
        <div class="form-field full-width">
            <label class="field-label" for="name">
                <i class="fas fa-map-marker-alt"></i>
                <span>Name</span>
            </label>
            <input
                id="name"
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
                id="category"
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

    <button class="submit-button" type="submit">
        <i class="fas fa-plus-circle"></i>
        <span>Create Placemark</span>
    </button>
</form>

<style>
    .modern-form {
        width: 100%;
    }

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
    }

    .submit-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .submit-button i {
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

        .submit-button {
            padding: 0.875rem 1.5rem;
            font-size: 1rem;
        }
    }
</style>

