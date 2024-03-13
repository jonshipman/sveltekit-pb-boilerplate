<script lang="ts">
	import { Alert, Button, Field } from '$lib/form';
	import ResetPasswordLink from '../reset-password-link.svelte';
	import Wrapper from '../wrapper.svelte';

	export let form;
</script>

<Wrapper title="Login to your account">
	<div slot="altaction">
		or <a class="text-indigo-500 hover:underline cursor-pointer" href="/register">register</a>
	</div>

	<Field label="Email address" name="email" required autocomplete="email" type="email" />
	<Field label="Password" name="password" required type="password" />

	<div>
		<Button wide>Login</Button>
	</div>

	{#if form?.errorMessage}
		<Alert>{form?.errorMessage}</Alert>
	{/if}

	<ResetPasswordLink />
</Wrapper>
