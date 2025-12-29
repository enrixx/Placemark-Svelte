<script lang="ts">
    import type {Placemark} from '$lib/types/placemark-types';
    import {loggedInUser} from '$lib/runes.svelte';
    import {placemarkService} from '$lib/services/placemark-service';

    interface Props {
        placemark: Placemark;
        onUpdate?: (updated: Placemark) => void;
    }

    let {placemark, onUpdate}: Props = $props();

    let isEditing = $state(false);
    let editName = $state("");
    let editCategoryName = $state("");
    let editDescription = $state("");
    let editLatitude = $state(0);
    let editLongitude = $state(0);

    function canEditOrDelete(p: Placemark) {
        return loggedInUser.role === 'admin' || loggedInUser._id === p.userid;
    }

    function startEditing() {
        editName = placemark.name;
        editCategoryName = placemark.categoryName;
        editDescription = placemark.description || "";
        editLatitude = placemark.latitude;
        editLongitude = placemark.longitude;
        isEditing = true;
    }

    function cancelEditing() {
        isEditing = false;
    }

    async function savePlacemark() {
        if (!placemark?._id) return;

        const updatedData = {
            name: editName,
            categoryName: editCategoryName,
            description: editDescription,
            latitude: editLatitude,
            longitude: editLongitude
        };

        const updated = await placemarkService.updatePlacemark(placemark._id, updatedData);
        if (updated) {
            isEditing = false;
            onUpdate?.(updated);
        }
    }
</script>

<div class="details-container">
    {#if isEditing}
        <div class="edit-header">
            <h2 class="title">
                <i class="fas fa-edit"></i>
                Edit Placemark
            </h2>
        </div>

        <form onsubmit={(e) => { e.preventDefault(); savePlacemark(); }}>
            <div class="form-grid">
                <div class="form-field full-width">
                    <label class="field-label" for="editName">
                        <i class="fas fa-map-marker-alt"></i>
                        Name
                    </label>
                    <input
                            id="editName"
                            class="field-input"
                            type="text"
                            bind:value={editName}
                            placeholder="Enter placemark name"
                            required
                    />
                </div>

                <div class="form-field full-width">
                    <label class="field-label" for="editCategory">
                        <i class="fas fa-tag"></i>
                        Category
                    </label>
                    <input
                            id="editCategory"
                            class="field-input"
                            type="text"
                            bind:value={editCategoryName}
                            placeholder="Enter category"
                            required
                    />
                </div>

                <div class="form-field full-width">
                    <label class="field-label" for="editDescription">
                        <i class="fas fa-align-left"></i>
                        Description
                    </label>
                    <textarea
                            id="editDescription"
                            class="field-textarea"
                            bind:value={editDescription}
                            placeholder="Enter description"
                            rows="4"
                    ></textarea>
                </div>

                <div class="form-field">
                    <label class="field-label" for="editLat">
                        <i class="fas fa-globe"></i>
                        Latitude
                    </label>
                    <input
                            id="editLat"
                            class="field-input"
                            type="number"
                            step="any"
                            bind:value={editLatitude}
                            placeholder="0.0000"
                            required
                    />
                </div>

                <div class="form-field">
                    <label class="field-label" for="editLng">
                        <i class="fas fa-globe"></i>
                        Longitude
                    </label>
                    <input
                            id="editLng"
                            class="field-input"
                            type="number"
                            step="any"
                            bind:value={editLongitude}
                            placeholder="0.0000"
                            required
                    />
                </div>
            </div>

            <div class="form-actions">
                <button class="action-button primary" type="submit">
                    <i class="fas fa-save"></i>
                    Save Changes
                </button>
                <button class="action-button secondary" type="button" onclick={cancelEditing}>
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        </form>
    {:else}
        <div class="view-header">
            <h3 class="section-title">
                <i class="fas fa-info-circle"></i>
                About This Place
            </h3>
            {#if canEditOrDelete(placemark)}
                <button class="edit-button" onclick={startEditing}>
                    <i class="fas fa-edit"></i>
                    <span>Edit</span>
                </button>
            {/if}
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-icon">
                    <i class="fas fa-align-left"></i>
                </div>
                <div class="info-content">
                    <div class="info-label">Description</div>
                    <div class="info-value">
                        {placemark.description || 'No description provided'}
                    </div>
                </div>
            </div>

            <div class="info-card">
                <div class="info-icon">
                    <i class="fas fa-map-marked-alt"></i>
                </div>
                <div class="info-content">
                    <div class="info-label">Coordinates</div>
                    <div class="info-value coordinates">
                        <span class="coordinate">
                            <strong>Lat:</strong> {placemark.latitude.toFixed(6)}
                        </span>
                        <span class="coordinate">
                            <strong>Lng:</strong> {placemark.longitude.toFixed(6)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .details-container {
        width: 100%;
    }

    /* Edit Mode */
    .edit-header {
        margin-bottom: 2rem;
    }

    .edit-header .title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
    }

    .edit-header .title i {
        color: #667eea;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
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

    .field-textarea {
        resize: vertical;
        min-height: 100px;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
    }

    .action-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        border: none;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-button.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .action-button.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .action-button.secondary {
        background: #f5f5f5;
        color: #666;
    }

    .action-button.secondary:hover {
        background: #e0e0e0;
    }

    /* View Mode */
    .view-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0;
    }

    .section-title i {
        color: #667eea;
    }

    .edit-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .edit-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .info-grid {
        display: grid;
        gap: 1.5rem;
    }

    .info-card {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        border: 2px solid #f0f0f0;
        border-radius: 16px;
        transition: all 0.3s ease;
    }

    .info-card:hover {
        border-color: #667eea;
        transform: translateX(4px);
    }

    .info-icon {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        font-size: 1.5rem;
    }

    .info-content {
        flex: 1;
    }

    .info-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
    }

    .info-value {
        font-size: 1.1rem;
        color: #2c3e50;
        line-height: 1.6;
    }

    .coordinates {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .coordinate {
        font-family: 'Courier New', monospace;
        font-size: 1rem;
    }

    .coordinate strong {
        color: #667eea;
        margin-right: 0.5rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .form-actions {
            flex-direction: column;
        }

        .action-button {
            width: 100%;
        }

        .view-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .edit-button {
            width: 100%;
            justify-content: center;
        }

        .info-card {
            flex-direction: column;
            gap: 1rem;
        }

        .section-title {
            font-size: 1.25rem;
        }
    }
</style>

