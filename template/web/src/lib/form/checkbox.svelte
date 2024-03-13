<script lang="ts">
	export const id = (Math.random() * 10e15).toString(16);
	export let value: string;
	export let checked = false;
	export let disabled = false;
	let className = 'contents';

	export { className as class };
</script>

<div class={className}>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<label for={id} class="cursor-pointer" on:click|stopPropagation>
		<input class="hidden" {id} {value} bind:checked {disabled} type="checkbox" />
		<span class="h-5 w-5 rounded border border-gray-400 dark:border-gray-600 block text-white">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" fill="none">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-miterlimit="10"
					d="M4.5 7.6 7 10.1l4.5-4.5"
				/>
			</svg>
		</span>
	</label>
</div>

<style lang="postcss">
	svg {
		display: none;
	}

	input:checked + span {
		background-color: theme('colors.indigo.500');
	}

	@media screen and (prefers-color-scheme: dark) {
		input:checked + span {
			background-color: theme('colors.yellow.600');
		}
	}

	input:checked + span svg {
		display: block;
	}
</style>
