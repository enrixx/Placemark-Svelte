<script lang="ts">
    import type {PlacemarkImage} from '$lib/types/placemark-types';
    import {placemarkService} from '$lib/services/placemark-service';
    import ImageCarousel from '$lib/ui/ImageCarousel.svelte';

    interface Props {
        placemarkId: string;
        images: PlacemarkImage[];
        onImageChange?: () => void;
    }

    let {placemarkId, images, onImageChange}: Props = $props();

    let selectedFile = $state<File | null>(null);
    let isUploading = $state(false);
    let uploadError = $state('');
    let fileInput = $state<HTMLInputElement>();

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            selectedFile = target.files[0];
            uploadError = '';
        }
    }

    async function uploadImage() {
        if (!selectedFile || !placemarkId) return;

        isUploading = true;
        uploadError = '';

        try {
            const updatedPlacemark = await placemarkService.uploadImage(placemarkId, selectedFile);
            if (updatedPlacemark) {
                selectedFile = null;
                if (fileInput) {
                    fileInput.value = '';
                }
                onImageChange?.();
            } else {
                uploadError = 'Failed to upload image. Please try again.';
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            uploadError = 'Failed to upload image. Please try again.';
        } finally {
            isUploading = false;
        }
    }

    function handleImageDeleted() {
        onImageChange?.();
    }
</script>

<div class="box">
    <h2 class="title is-5">Images</h2>

    <ImageCarousel
            {images}
            {placemarkId}
            onImageDeleted={handleImageDeleted}
    />

    <div class="upload-section">
        <div class="file has-name is-fullwidth">
            <label class="file-label">
                <input
                        class="file-input"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        onchange={handleFileSelect}
                        bind:this={fileInput}
                />
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">Choose a file…</span>
                </span>
                <span class="file-name">
                    {selectedFile ? selectedFile.name : 'No file selected'}
                </span>
            </label>
        </div>

        {#if selectedFile}
            <button
                    class="button is-primary is-fullwidth mt-3"
                    onclick={uploadImage}
                    disabled={isUploading}
            >
                {#if isUploading}
                    <span class="icon">
                        <i class="fas fa-spinner fa-pulse"></i>
                    </span>
                    <span>Uploading...</span>
                {:else}
                    <span class="icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </span>
                    <span>Upload Image</span>
                {/if}
            </button>
        {/if}

        {#if uploadError}
            <div class="notification is-danger is-light mt-3">
                {uploadError}
            </div>
        {/if}
    </div>
</div>

<style>
    .upload-section {
        margin-top: 1.5rem;
    }
</style>

