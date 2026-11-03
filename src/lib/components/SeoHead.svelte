<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/data/site.ts';

	let { title, description = site.description }: { title?: string; description?: string } = $props();
	// Pages are prerendered, so build absolute URLs from the live address rather than the request.
	const canonical = $derived(site.url + page.url.pathname);
	const full = $derived(title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`);
</script>

<svelte:head>
	<title>{full}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={full} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<link rel="canonical" href={canonical} />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary" />
</svelte:head>
