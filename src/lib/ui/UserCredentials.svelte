<script lang="ts">
    interface Props {
        email: string;
        password: string;
    }

    let {email = $bindable(), password = $bindable()}: Props = $props();
</script>

<div class="form-field">
    <label class="field-label" for="email">
        <i class="fas fa-envelope"></i>
        <span>Email</span>
    </label>
    <input
            id="email"
            class="field-input"
            type="email"
            placeholder="Enter your email"
            bind:value={email}
            required
    />
</div>

<div class="form-field">
    <label class="field-label" for="password">
        <i class="fas fa-lock"></i>
        <span>Password</span>
    </label>
    <input
            id="password"
            class="field-input"
            type="password"
            placeholder="Enter your password"
            bind:value={password}
            required
    />
</div>

<style>
    .form-field {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;
    }

    .field-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
    }

    .field-label i {
        color: #667eea;
        font-size: 0.9rem;
    }

    .field-input {
        width: 100%;
        padding: 0.875rem 1rem;
        border: 2px solid var(--border-color);
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.3s ease;
        font-family: inherit;
        background: var(--bg-primary);
        color: var(--text-primary);
    }

    .field-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .field-input::placeholder {
        color: var(--text-secondary);
        opacity: 0.6;
    }
</style>

