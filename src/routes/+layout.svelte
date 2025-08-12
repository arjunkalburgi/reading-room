<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style src="$lib/styles/global.css" global></style>
</svelte:head>

{@render children?.()}
