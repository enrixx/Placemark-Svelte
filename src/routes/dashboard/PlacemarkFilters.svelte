<script lang="ts">
    interface Props {
        searchQuery: string;
        selectedCategory: string;
        categories: string[];
        placemarkNames?: string[];
        onSearchChange: (value: string) => void;
        onCategoryChange: (value: string) => void;
        onReset: () => void;
    }

    let {
        searchQuery,
        selectedCategory,
        categories,
        placemarkNames = [],
        onSearchChange,
        onCategoryChange,
        onReset
    }: Props = $props();
</script>

<div class="filters-container">
    <div class="filters-grid">
        <div class="filter-field">
            <label class="filter-label" for="search">
                <i class="fas fa-search"></i>
                <span>Search Placemarks</span>
            </label>
            <div class="input-wrapper">
                <input
                        id="search"
                        class="modern-input"
                        type="text"
                        list="placemark-names"
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        oninput={(e) => onSearchChange(e.currentTarget.value)}
                />
                <datalist id="placemark-names">
                    {#each placemarkNames as name}
                        <option value={name}></option>
                    {/each}
                </datalist>
            </div>
        </div>

        <div class="filter-field">
            <label class="filter-label" for="category">
                <i class="fas fa-filter"></i>
                <span>Filter by Category</span>
            </label>
            <div class="select-wrapper">
                <select
                        id="category"
                        class="modern-select"
                        onchange={(e) => onCategoryChange(e.currentTarget.value)}
                >
                    <option value="" selected={selectedCategory === ""}>All Categories</option>
                    {#each categories as category}
                        <option value={category} selected={category === selectedCategory}>{category}</option>
                    {/each}
                </select>
                <i class="fas fa-chevron-down select-icon"></i>
            </div>
        </div>

        <div class="filter-field reset-field">
            <label class="filter-label">&nbsp;</label>
            <button class="reset-button" onclick={onReset}>
                <i class="fas fa-undo"></i>
                <span>Reset</span>
            </button>
        </div>
    </div>
</div>

<style>
    .filters-container {
        background: white;
        border-radius: 20px;
        padding: 1.75rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        border: 2px solid #f0f0f0;
    }

    .filters-grid {
        display: grid;
        grid-template-columns: 2fr 1fr auto;
        gap: 1.5rem;
        align-items: end;
    }

    .filter-field {
        display: flex;
        flex-direction: column;
    }

    .filter-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #495057;
        margin-bottom: 0.75rem;
        font-size: 0.95rem;
    }

    .filter-label i {
        color: #667eea;
        font-size: 0.9rem;
    }

    .input-wrapper,
    .select-wrapper {
        position: relative;
    }

    .modern-input,
    .modern-select {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: inherit;
        background: white;
    }

    .modern-input:focus,
    .modern-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .modern-input::placeholder {
        color: #999;
    }

    .select-wrapper {
        position: relative;
    }

    .modern-select {
        appearance: none;
        padding-right: 2.5rem;
        cursor: pointer;
    }

    .select-icon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #667eea;
        pointer-events: none;
        font-size: 0.9rem;
    }

    .reset-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
        border: 2px solid #667eea;
        border-radius: 12px;
        color: #667eea;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .reset-button:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    @media (max-width: 1024px) {
        .filters-grid {
            grid-template-columns: 1fr 1fr;
        }

        .reset-field {
            grid-column: 1 / -1;
        }

        .reset-button {
            width: 100%;
        }
    }

    @media (max-width: 768px) {
        .filters-container {
            padding: 1.25rem;
            border-radius: 16px;
        }

        .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .filter-label span {
            font-size: 0.9rem;
        }

        .modern-input,
        .modern-select {
            padding: 0.75rem;
            font-size: 0.95rem;
        }
    }
</style>
