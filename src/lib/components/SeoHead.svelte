<script lang="ts">
	import { page } from '$app/state';
	import { site } from '#lib/data/site.ts';

	let { title, description = site.description }: { title?: string; description?: string } = $props();
	// Pages are prerendered, so build absolute URLs from the live address rather than the request.
	const canonicalUrl = $derived(site.url + page.url.pathname);
	const pageTitle = $derived(title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:card" content="summary" />
</svelte:head>
