<script lang="ts">
	import { Alert, Button, Field } from '$lib/form';
	import ResetPasswordLink from '../reset-password-link.svelte';
	import Wrapper from '../wrapper.svelte';

	export let form;
</script>

<Wrapper title="Register your account">
	<Field label="Email address" name="email" required autocomplete="email" type="email" />
	<Field label="Password" name="password" required type="password" />
	<Field label="Confirm Password" name="passwordConfirm" required type="password" />

	<div>
		<Button wide>Register</Button>
	</div>

	{#if form?.errorMessage}
		<Alert>{form?.errorMessage}</Alert>
	{/if}

	{#if form?.message}
		<Alert success>{form?.message}</Alert>
	{/if}

	<ResetPasswordLink />
</Wrapper>
