<script lang="ts">
	export let label = '';
	export let name: string;
	export let type = 'text';
	export let autocomplete = '';
	export let required = false;

	const id = (Math.random() * 10e15).toString(16);
</script>

<div>
	{#if label}
		<label for={id} class="block text-sm font-medium leading-6 dark:text-gray-100 text-gray-900">
			{label}
		</label>
	{/if}
	<div class="mt-2">
		<input
			{id}
			{name}
			{type}
			{autocomplete}
			{required}
			class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
		/>
	</div>
</div>
