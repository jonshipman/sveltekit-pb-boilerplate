<script lang="ts">
	import { Alert, Button, Field } from '$lib/form';
	import Wrapper from '../wrapper.svelte';

	export let form;
</script>

<Wrapper title="Reset your password">
	<div slot="altaction">We'll send you an email with a link to reset your password.</div>

	<Field label="Email address" name="email" required autocomplete="email" type="email" />

	<div>
		<Button wide>Request Reset Password</Button>
	</div>

	{#if form?.message}
		<Alert success>{form.message}</Alert>
	{/if}

	<p class="text-center">
		<a class="text-indigo-500 hover:underline cursor-pointer" href="/login">login</a>
	</p>
</Wrapper>
