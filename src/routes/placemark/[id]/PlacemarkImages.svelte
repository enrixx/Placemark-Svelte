<script lang="ts">
    import {enhance} from '$app/forms';
    import type {PlacemarkImage, User} from '$lib/types/placemark-types';

    interface Props {
        placemarkId: string;
        images: PlacemarkImage[];
        user: User;
        onImageChange?: () => void;
    }

    let {images, user, onImageChange}: Props = $props();

    let selectedFile = $state<File | null>(null);
    let previewUrl = $state<string | null>(null);
    let isUploading = $state(false);
    let uploadError = $state('');
    let fileInput = $state<HTMLInputElement>();
    let lightboxImage = $state<PlacemarkImage | null>(null);
    let isDeleting = $state(false);

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedFile = target.files[0];
            uploadError = '';

            // Create preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            previewUrl = URL.createObjectURL(selectedFile);
        }
    }

    function cancelUpload() {
        selectedFile = null;
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }
        if (fileInput) {
            fileInput.value = '';
        }
        uploadError = '';
    }

    function openLightbox(image: PlacemarkImage) {
        lightboxImage = image;
    }

    function closeLightbox() {
        lightboxImage = null;
    }

    const canDelete = (image: PlacemarkImage): boolean => {
        if (!user || !user._id) return false;
        return image.uploaderId === user._id || user.role === 'admin';
    };

    function handleUpload({ formData }: { formData: FormData }) {
        if (selectedFile) {
            formData.set('image', selectedFile);
        }
        isUploading = true;
        uploadError = '';
        return async ({ result }: any) => {
            isUploading = false;
            if (result.type === 'success') {
                cancelUpload();
                onImageChange?.();
            } else if (result.type === 'failure') {
                uploadError = result.data?.message || 'Failed to upload image';
            }
        };
    }
</script>

<div class="images-container">
    <div class="header">
        <h2 class="title is-4">
            <i class="fas fa-images"></i>
            Gallery
        </h2>
        <span class="image-count">{images.length} {images.length === 1 ? 'Photo' : 'Photos'}</span>
    </div>

    <!-- Image Grid -->
    <div class="image-grid">
        {#each images as image, index}
            <div
                    class="grid-item"
                    role="button"
                    tabindex="0"
                    onclick={() => openLightbox(image)}
                    onkeydown={(e) => e.key === 'Enter' && openLightbox(image)}
            >
                <img src={image.url} alt="Placemark {index + 1}"/>
                <div class="overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            </div>
        {/each}

        <!-- Upload Card -->
        <div class="grid-item upload-card">
            <label class="upload-label">
                <input
                        class="file-input"
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        onchange={handleFileSelect}
                        bind:this={fileInput}
                />
                {#if !selectedFile}
                    <div class="upload-placeholder">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <span>Add Photo</span>
                    </div>
                {:else}
                    <div class="upload-preview">
                        <img src={previewUrl} alt="Preview"/>
                    </div>
                {/if}
            </label>
        </div>
    </div>

    {#if selectedFile}
        <form
                action="?/uploadImage"
                method="POST"
                enctype="multipart/form-data"
                use:enhance={handleUpload}
        >
            <div class="upload-actions">
                <button
                        class="button is-primary"
                        type="submit"
                        disabled={isUploading}
                >
                    {#if isUploading}
                        <span class="icon">
                            <i class="fas fa-spinner fa-pulse"></i>
                        </span>
                        <span>Uploading...</span>
                    {:else}
                        <span class="icon">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>Upload</span>
                    {/if}
                </button>
                <button
                        class="button is-light"
                        type="button"
                        onclick={cancelUpload}
                        disabled={isUploading}
                >
                    <span class="icon">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>Cancel</span>
                </button>
            </div>
        </form>
    {/if}

    {#if uploadError}
        <div class="notification is-danger is-light">
            {uploadError}
        </div>
    {/if}

    {#if images.length === 0}
        <div class="empty-state">
            <i class="fas fa-images"></i>
            <p>No photos yet</p>
            <small>Upload your first photo above</small>
        </div>
    {/if}
</div>

<!-- Lightbox Modal -->
{#if lightboxImage}
    <div
            class="lightbox"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            onclick={closeLightbox}
            onkeydown={(e) => e.key === 'Escape' && closeLightbox()}
    >
        <button class="close-button" onclick={closeLightbox} aria-label="Close lightbox">
            <i class="fas fa-times"></i>
        </button>

        <div
                class="lightbox-content"
                role="button"
                tabindex="0"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
        >
            <img src={lightboxImage.url} alt="Placemark in full view"/>

            {#if canDelete(lightboxImage)}
                <form
                        action="?/deleteImage"
                        method="POST"
                        use:enhance={({ cancel }) => {
                        if (!confirm('Are you sure you want to delete this image?')) {
                            cancel();
                            return;
                        }
                        isDeleting = true;
                        return async ({ result }) => {
                            isDeleting = false;
                            if (result.type === 'success') {
                                closeLightbox();
                                onImageChange?.();
                            } else {
                                alert('Failed to delete image. Please try again.');
                            }
                        };
                    }}
                        style="display: contents;"
                >
                    <input type="hidden" name="imageId" value={lightboxImage._id}/>
                    <button
                            type="submit"
                            class="delete-button"
                            disabled={isDeleting}
                            title="Delete image"
                    >
                        <i class="fas fa-trash-alt"></i>
                        <span>Delete</span>
                    </button>
                </form>
            {/if}
        </div>
    </div>
{/if}

<style>
    .images-container {
        background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(102, 126, 234, 0.1);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1.25rem;
        border-bottom: 3px solid #f0f0f0;
    }

    .header .title {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #2c3e50;
        font-weight: 700;
    }

    .header .title i {
        color: #667eea;
        font-size: 1.75rem;
    }

    .image-count {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .image-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.25rem;
        margin-bottom: 1rem;
    }

    .grid-item {
        aspect-ratio: 1;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .grid-item:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .grid-item:focus {
        outline: 3px solid #667eea;
        outline-offset: 2px;
    }

    .grid-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .overlay {
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
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(2px);
    }

    .grid-item:hover .overlay {
        opacity: 1;
    }

    .overlay i {
        color: white;
        font-size: 2.5rem;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }

    .grid-item:hover .overlay i {
        transform: scale(1);
    }

    .upload-card {
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border: 3px dashed #667eea;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .upload-card:hover {
        background: linear-gradient(135deg, #667eea30 0%, #764ba230 100%);
        border-color: #764ba2;
        border-style: solid;
    }

    .upload-label {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .upload-card:hover .upload-label {
        transform: scale(1.05);
    }

    .file-input {
        display: none;
    }

    .upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        color: #667eea;
        transition: all 0.3s ease;
    }

    .upload-card:hover .upload-placeholder {
        color: #764ba2;
    }

    .upload-placeholder i {
        font-size: 2.5rem;
        transition: transform 0.3s ease;
    }

    .upload-card:hover .upload-placeholder i {
        transform: translateY(-4px);
    }

    .upload-placeholder span {
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: 0.5px;
    }

    .upload-preview {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .upload-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .upload-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .upload-actions .button {
        flex: 1;
    }

    /* Lightbox */
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        animation: fadeIn 0.3s ease;
    }


    .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 1001;
    }

    .close-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        animation: zoomIn 0.3s ease;
    }


    .lightbox-content img {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    .delete-button {
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 56, 96, 0.9);
        border: none;
        border-radius: 25px;
        padding: 0.75rem 1.5rem;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
    }

    .delete-button:hover:not(:disabled) {
        background: rgba(255, 56, 96, 1);
        transform: translateX(-50%) scale(1.05);
    }

    .delete-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @media (max-width: 1024px) {
        .image-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 1rem;
        }
    }

    @media (max-width: 768px) {
        .image-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.875rem;
        }

        .images-container {
            padding: 1.25rem;
            border-radius: 16px;
        }

        .header {
            margin-bottom: 1.5rem;
        }

        .header .title {
            font-size: 1.25rem;
        }

        .header .title i {
            font-size: 1.5rem;
        }

        .image-count {
            font-size: 0.75rem;
            padding: 0.3rem 0.75rem;
        }

        .lightbox {
            padding: 1rem;
        }

        .delete-button {
            bottom: -50px;
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
        }

        .overlay i {
            font-size: 2rem;
        }
    }

    @media (max-width: 480px) {
        .image-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }
    }
</style>

