<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import Blob from '#lib/components/Blob.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { uiState } from '#lib/state/ui.svelte.ts';

	const notFound = $derived(page.status === 404);
</script>

<SeoHead title={notFound ? 'Not found' : 'Something went wrong'} />

<div class="main-pad min-h-[70vh] items-center justify-center gap-6 text-center">
	<div class="relative flex size-40 items-center justify-center text-on-ter-c">
		<Blob shape="clover" fill="var(--ter-c)" class="absolute inset-0 size-full animate-[spin_40s_linear_infinite]" />
		<span class="disp relative text-5xl">{page.status}</span>
	</div>
	<h1 class="disp m-0 text-[clamp(36px,5vw,56px)]">
		{notFound ? "This page doesn't exist." : 'Something went wrong.'}
	</h1>
	<p class="m-0 max-w-[48ch] text-lg text-on-var">
		{notFound
			? "The link might be outdated, or the page was never here. You can search the site or go back to the home page."
			: (page.error?.message ?? 'Try again in a moment.')}
	</p>
	<div class="flex flex-wrap justify-center gap-3">
		<a class="btn filled" href="/"><ArrowLeft class="icon" aria-hidden="true" />Back home</a>
		<button type="button" class="btn tonal" onclick={() => uiState.openPalette()}
			><Search class="icon" aria-hidden="true" />Search the site</button
		>
	</div>
</div>
