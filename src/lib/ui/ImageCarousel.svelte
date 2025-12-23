<script lang="ts">
    import type {PlacemarkImage} from '$lib/types/placemark-types';
    import {placemarkService} from '$lib/services/placemark-service';
    import {loggedInUser} from '$lib/runes.svelte';

    interface Props {
        images: PlacemarkImage[];
        placemarkId: string;
        onImageDeleted?: () => void;
    }

    let {images = [], placemarkId, onImageDeleted}: Props = $props();

    let currentIndex = $state(0);
    let isDeleting = $state(false);

    // Reset currentIndex if it's out of bounds when images change
    $effect(() => {
        if (images.length > 0 && currentIndex >= images.length) {
            currentIndex = images.length - 1;
        } else if (images.length === 0) {
            currentIndex = 0;
        }
    });

    const canDelete = (image: PlacemarkImage): boolean => {
        if (!loggedInUser._id) return false;
        return image.uploaderId === loggedInUser._id || loggedInUser.role === 'admin';
    };

    const nextImage = () => {
        if (images.length > 0) {
            currentIndex = (currentIndex + 1) % images.length;
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
        }
    };

    const deleteImage = async () => {
        if (!images[currentIndex]?._id) {
            console.error('No image ID found at current index');
            return;
        }

        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }

        isDeleting = true;
        try {
            const result = await placemarkService.deleteImage(placemarkId, images[currentIndex]._id!);
            if (result) {
                if (onImageDeleted) {
                    await onImageDeleted();
                }
            } else {
                alert('Failed to delete image. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        } finally {
            isDeleting = false;
        }
    };
</script>

{#if images && images.length > 0}
    <div class="image-carousel">
        <div class="carousel-container">
            <div class="image-wrapper">
                <img src={images[currentIndex].url} alt="Placemark image {currentIndex + 1}"/>

                {#if canDelete(images[currentIndex])}
                    <button
                            class="delete-button"
                            onclick={deleteImage}
                            disabled={isDeleting}
                            title="Delete image"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                {/if}
            </div>

            {#if images.length > 1}
                <button class="nav-button prev" onclick={prevImage} title="Previous image">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="nav-button next" onclick={nextImage} title="Next image">
                    <i class="fas fa-chevron-right"></i>
                </button>

                <div class="carousel-dots">
                    {#each images as _, index}
                        <button
                                class="dot"
                                class:active={index === currentIndex}
                                onclick={() => (currentIndex = index)}
                                title="Go to image {index + 1}"
                        ></button>
                    {/each}
                </div>
            {/if}

            <div class="image-counter">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    </div>
{:else}
    <div class="notification is-info is-light">
        No images uploaded yet.
    </div>
{/if}

<style>
    .image-carousel {
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
    }

    .carousel-container {
        position: relative;
        width: 100%;
        background: #f5f5f5;
        border-radius: 6px;
        overflow: hidden;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        padding-top: 75%; /* 4:3 aspect ratio */
    }

    .image-wrapper img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .delete-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 56, 96, 0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 10;
    }

    .delete-button:hover:not(:disabled) {
        background: rgba(255, 56, 96, 1);
        transform: scale(1.1);
    }

    .delete-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
        z-index: 5;
    }

    .nav-button:hover {
        background: rgba(0, 0, 0, 0.7);
    }

    .nav-button.prev {
        left: 10px;
    }

    .nav-button.next {
        right: 10px;
    }

    .carousel-dots {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 5;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        cursor: pointer;
        transition: background 0.2s ease;
        padding: 0;
    }

    .dot:hover,
    .dot.active {
        background: rgba(255, 255, 255, 1);
    }

    .image-counter {
        position: absolute;
        bottom: 15px;
        right: 15px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.85rem;
        z-index: 5;
    }

    @media (max-width: 768px) {
        .nav-button {
            width: 35px;
            height: 35px;
            font-size: 1rem;
        }

        .delete-button {
            width: 35px;
            height: 35px;
            font-size: 1rem;
        }
    }
</style>

