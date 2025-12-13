<script lang="ts">
  interface Props {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  let { firstName = $bindable(), lastName = $bindable(), email = $bindable(), password = $bindable() }: Props = $props();
</script>

<div class="field is-horizontal">
  <div class="field-body">
    <div class="field">
      <label class="label" for="firstName">First Name</label>
      <div class="control">
        <input
          id="firstName"
          class="input"
          type="text"
          placeholder="Enter first name"
          bind:value={firstName}
          required
        />
      </div>
    </div>
    <div class="field">
      <label class="label" for="lastName">Last Name</label>
      <div class="control">
        <input
          id="lastName"
          class="input"
          type="text"
          placeholder="Enter last name"
          bind:value={lastName}
          required
        />
      </div>
    </div>
  </div>
</div>

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
      minlength="6"
    />
  </div>
</div>
