<script lang="ts">
    import type {Placemark} from '$lib/types/placemark-types';

    interface Props {
        placemark: Placemark;
        isSelected: boolean;
        canEditOrDelete: boolean;
        onSelect: () => void;
        onDelete: () => void;
    }

    let {placemark, isSelected, canEditOrDelete, onSelect, onDelete}: Props = $props();

    let hasImages = $derived(placemark.images && placemark.images.length > 0);
    let firstImage = $derived(hasImages ? placemark.images![0].url : null);
</script>

<div
    class="card placemark-card"
    class:is-selected={isSelected}
    onclick={onSelect}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && onSelect()}
>
    <div class="card-content">
        <div class="media">
            <div class="media-left">
                {#if firstImage}
                    <figure class="image is-64x64">
                        <img src={firstImage} alt={placemark.name} class="is-rounded" />
                    </figure>
                {:else}
                    <figure class="image is-64x64">
                        <div class="placeholder-image">
                            <i class="fas fa-map-marker-alt fa-2x"></i>
                        </div>
                    </figure>
                {/if}
            </div>
            <div class="media-content">
                <p class="title is-5">{placemark.name}</p>
                <p class="subtitle is-6">
                    <span class="tag is-info is-light">
                        <span class="icon">
                            <i class="fas fa-tag"></i>
                        </span>
                        <span>{placemark.categoryName}</span>
                    </span>
                </p>
            </div>
        </div>

        {#if placemark.description}
            <div class="content">
                <p class="description-text">{placemark.description}</p>
            </div>
        {/if}

        <div class="level is-mobile">
            <div class="level-left">
                <div class="level-item">
                    <span class="icon-text is-size-7">
                        <span class="icon has-text-grey">
                            <i class="fas fa-location-dot"></i>
                        </span>
                        <span class="has-text-grey">{placemark.latitude.toFixed(4)}, {placemark.longitude.toFixed(4)}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <footer class="card-footer">
        <a href="/placemark/{placemark._id}" class="card-footer-item" onclick={(e) => e.stopPropagation()}>
            <span class="icon">
                <i class="fas fa-eye"></i>
            </span>
            <span>View Details</span>
        </a>
        {#if canEditOrDelete}
            <button
                class="card-footer-item has-text-danger"
                onclick={(e) => { e.stopPropagation(); onDelete(); }}
            >
                <span class="icon">
                    <i class="fas fa-trash"></i>
                </span>
                <span>Delete</span>
            </button>
        {/if}
    </footer>
</div>

<style>
    .placemark-card {
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        height: 100%;
    }

    .placemark-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
        border-color: #3273dc;
    }

    .placemark-card.is-selected {
        border-color: #48c774;
        box-shadow: 0 8px 16px rgba(72, 199, 116, 0.3);
        background-color: #effaf3;
    }

    .placeholder-image {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .description-text {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-bottom: 0.5rem;
    }

    .card-footer-item {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 0.75rem;
    }

    .card-footer-item:hover {
        background-color: #f5f5f5;
    }

    .card-footer-item.has-text-danger:hover {
        background-color: #feecf0;
    }
</style>

