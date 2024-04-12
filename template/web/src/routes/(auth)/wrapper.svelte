<script lang="ts">
	export let title: string;
</script>

<h2
	class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100"
>
	{title}
</h2>

<div class="text-center text-black dark:text-white">
	<slot name="altaction">
		or <a class="text-indigo-500 hover:underline cursor-pointer" href="/login">login</a>
	</slot>
</div>

<div class="mt-10">
	<form class="space-y-6" method="POST">
		<slot />
	</form>
</div>
