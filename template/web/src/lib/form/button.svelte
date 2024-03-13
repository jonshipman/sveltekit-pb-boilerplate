<script lang="ts">
	export let wide = false;
	export let href = '';
	export let weak = false;

	const classes = {
		default: 'text-sm font-semibold leading-6',
		strong:
			'text-white rounded-md bg-indigo-600 px-3 py-1.5 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
		weak: 'text-inherit',
		wide: 'flex w-full justify-center items-center'
	};
</script>

{#if href}
	<a
		{href}
		class="{classes.default} {weak ? classes.weak : classes.strong} {wide ? classes.wide : ''}"
	>
		<slot />
	</a>
{:else}
	<button
		type="submit"
		on:click
		on:keypress
		class="{classes.default} {weak ? classes.weak : classes.strong} {wide ? classes.wide : ''}"
	>
		<slot />
	</button>
{/if}
