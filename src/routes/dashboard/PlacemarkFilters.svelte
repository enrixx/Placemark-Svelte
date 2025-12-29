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

<div class="box">
    <div class="columns is-multiline">
        <div class="column is-half">
            <div class="field">
                <label class="label" for="search">Search Placemarks</label>
                <div class="control has-icons-left">
                    <input
                        id="search"
                        class="input"
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
                    <span class="icon is-left">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>
        </div>

        <div class="column is-one-third">
            <div class="field">
                <label class="label" for="category">Filter by Category</label>
                <div class="control has-icons-left">
                    <div class="select is-fullwidth">
                        <select
                                id="category"
                                onchange={(e) => onCategoryChange(e.currentTarget.value)}
                        >
                            <option value="" selected={selectedCategory === ""}>All Categories</option>
                            {#each categories as category}
                                <option value={category} selected={category === selectedCategory}>{category}</option>
                            {/each}
                        </select>
                    </div>
                    <span class="icon is-left">
                        <i class="fas fa-filter"></i>
                    </span>
                </div>
            </div>
        </div>

        <div class="column is-narrow">
            <div class="field">
                <div class="label">&nbsp;</div>
                <button class="button is-light" onclick={onReset}>
                    <span class="icon">
                        <i class="fas fa-undo"></i>
                    </span>
                    <span>Reset Filters</span>
                </button>
            </div>
        </div>
    </div>
</div>
