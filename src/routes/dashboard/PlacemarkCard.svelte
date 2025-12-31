<script lang="ts">
    import { enhance } from '$app/forms';
    import type {Placemark} from '$lib/types/placemark-types';

    interface Props {
        placemark: Placemark;
        isSelected: boolean;
        canEditOrDelete: boolean;
        onSelect: () => void;
    }

    let {placemark, isSelected, canEditOrDelete, onSelect}: Props = $props();

    let hasImages = $derived(placemark.images && placemark.images.length > 0);
    let firstImage = $derived(hasImages ? placemark.images![0].url : null);
    let photoCountText = $derived(
        hasImages
            ? `${placemark.images!.length} ${placemark.images!.length === 1 ? 'photo' : 'photos'}`
            : ''
    );
</script>

<div
        class="placemark-card"
        class:is-selected={isSelected}
>
    <div
            class="card-clickable-area"
            onclick={onSelect}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && onSelect()}
    >
        <div class="card-image-container">
            {#if firstImage}
                <img src={firstImage} alt={placemark.name} class="card-thumbnail"/>
                <div class="image-overlay">
                    <i class="fas fa-expand"></i>
                </div>
            {:else}
                <div class="placeholder-image">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            {/if}
        </div>

        <div class="card-body">
            <div class="card-header">
                <h3 class="card-title">{placemark.name}</h3>
                <span class="card-badge">
                    <i class="fas fa-tag"></i>
                    {placemark.categoryName}
                </span>
            </div>

            {#if placemark.description}
                <p class="card-description">{placemark.description}</p>
            {/if}

            <div class="card-meta">
                <span class="meta-item">
                    <i class="fas fa-location-dot"></i>
                    {placemark.latitude.toFixed(4)}, {placemark.longitude.toFixed(4)}
                </span>
                {#if hasImages}
                    <span class="meta-item">
                        <i class="fas fa-images"></i>
                        <span>{photoCountText}</span>
                    </span>
                {/if}
            </div>
        </div>
    </div>

    <div class="card-footer">
        <a href="/placemark/{placemark._id}" class="footer-button primary">
            <i class="fas fa-eye"></i>
            <span>View Details</span>
        </a>
        {#if canEditOrDelete}
            <form action="?/delete" method="POST" class="footer-form" use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                    }
                };
            }}>
                <input type="hidden" name="id" value={placemark._id} />
                <button
                        class="footer-button danger"
                        type="submit"
                        onclick={(e) => {
                            if (!confirm("Are you sure you want to delete this placemark?")) {
                                e.preventDefault();
                            }
                        }}
                >
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </button>
            </form>
        {/if}
    </div>
</div>

<style>
    .placemark-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid #f0f0f0;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        position: relative;
    }

    .placemark-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
        border-color: #667eea;
    }

    .placemark-card.is-selected {
        border-color: #667eea;
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
    }

    .placemark-card.is-selected::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 1;
    }

    .card-clickable-area {
        flex: 1;
        display: flex;
        flex-direction: column;
        cursor: pointer;
    }

    .card-clickable-area:focus {
        outline: none;
    }

    .card-clickable-area:focus-visible {
        outline: 3px solid #667eea;
        outline-offset: -3px;
    }

    .card-image-container {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .card-thumbnail {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .placemark-card:hover .card-thumbnail {
        transform: scale(1.1);
    }

    .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .placemark-card:hover .image-overlay {
        opacity: 1;
    }

    .image-overlay i {
        color: white;
        font-size: 2rem;
    }

    .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .placeholder-image i {
        font-size: 3rem;
    }

    .card-body {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .card-header {
        margin-bottom: 1rem;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .card-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        color: #667eea;
        padding: 0.35rem 0.75rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .card-description {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .card-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: auto;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #999;
        font-size: 0.85rem;
    }

    .meta-item i {
        color: #667eea;
    }

    .card-footer {
        display: flex;
        border-top: 2px solid #f0f0f0;
        min-height: 54px;
    }

    .footer-button.primary,
    .footer-form {
        width: 50%;
        flex: 0 0 50%;
        box-sizing: border-box;
    }

    .card-footer > :only-child {
        width: 100%;
        flex: 0 0 100%;
    }

    .footer-form {
        display: flex;
        margin: 0;
        padding: 0;
        border-left: 1px solid #f0f0f0;
    }

    .footer-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        border: none;
        background: transparent;
        color: #666;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        line-height: 1.5;
    }

    .footer-button.danger {
        width: 100%;
        height: 100%;
        margin: 0;
        color: #ff3860;
    }

    .footer-button.primary:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .footer-button.danger:hover {
        background: #feecf0;
        color: #ff3860;
    }

    @media (max-width: 768px) {
        .card-image-container {
            height: 160px;
        }

        .card-body {
            padding: 1rem;
        }

        .card-title {
            font-size: 1.1rem;
        }

        .footer-button {
            padding: 0.75rem;
            font-size: 0.9rem;
        }

        .footer-button span {
            display: none;
        }

        .footer-button i {
            font-size: 1.2rem;
        }
    }

    :global(html[data-theme="dark"]) .placemark-card {
        background: #2d3748;
        border-color: #4a5568;
    }

    :global(html[data-theme="dark"]) .placemark-card:hover {
        border-color: #667eea;
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    :global(html[data-theme="dark"]) .placemark-card.is-selected {
        background: linear-gradient(to bottom, #2d3748 0%, #1a202c 100%);
        border-color: #667eea;
    }

    :global(html[data-theme="dark"]) .card-image-container {
        background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
    }

    :global(html[data-theme="dark"]) .card-title {
        color: #e2e8f0;
    }

    :global(html[data-theme="dark"]) .card-description {
        color: #a0aec0;
    }

    :global(html[data-theme="dark"]) .card-footer {
        border-top-color: #4a5568;
    }

    :global(html[data-theme="dark"]) .footer-form {
        border-left-color: #4a5568;
    }

    :global(html[data-theme="dark"]) .footer-button {
        color: #a0aec0;
    }

    :global(html[data-theme="dark"]) .footer-button:hover {
        color: white;
    }

    :global(html[data-theme="dark"]) .footer-button.danger:hover {
        background: rgba(255, 56, 96, 0.2);
    }
</style>