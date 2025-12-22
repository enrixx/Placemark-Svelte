<script lang="ts">
    interface Props {
        email: string;
        password: string;
    }

    let {email = $bindable(), password = $bindable()}: Props = $props();
</script>

<div class="field">
    <label class="label" for="email">Email</label>
    <div class="control">
        <input
                id="email"
                class="input"
                type="email"
                placeholder="Enter email"
                bind:value={email}
                required
        />
    </div>
</div>

<div class="field">
    <label class="label" for="password">Password</label>
    <div class="control">
        <input
                id="password"
                class="input"
                type="password"
                placeholder="Enter Password"
                bind:value={password}
                required
        />
    </div>
</div>

