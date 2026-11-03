<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { createQuery } from '@tanstack/svelte-query';
	import { githubQueries } from '#lib/github/queries.ts';
	import type { Repo } from '#lib/github/api.ts';
	import { languageMark, timeAgo } from '#lib/format.ts';

	// Shown while loading (and in the prerendered HTML) so the card never looks empty.
	const fallback: Repo[] = [
		['The-Mystora-Project', 'WoodenAccentsMod', 'Kotlin'],
		['Mystery2099', 'alfred-go', 'TypeScript'],
		['Mystery2099', 'happycms', 'PHP'],
		['The-Mystora-Project', 'VoxLib', 'Kotlin'],
		['Mystery2099', 'dnd-5e-spellbook', 'Svelte']
	].map(([owner, name, language]) => ({
		name,
		fullName: `${owner}/${name}`,
		url: `https://github.com/${owner}/${name}`,
		description: null,
		language,
		stars: 0,
		pushedAt: '',
		fork: false,
		archived: false
	}));

	const query = createQuery(() => ({ ...githubQueries.recent(), placeholderData: fallback }));
	const repos = $derived(query.data ?? fallback);
	const live = $derived(query.isSuccess && !query.isPlaceholderData);
</script>

<div class="card min-w-0 flex-[2_1_440px] px-6 pt-6 pb-3">
	<div class="mb-1.5 flex items-center justify-between gap-3">
		<h3 class="m-0 text-lg font-[650]">Recently updated</h3>
		<span class="mono text-xs text-on-var" aria-live="polite">
			{#if query.isError}cached list{:else if live}from GitHub{:else}from GitHub…{/if}
		</span>
	</div>
	<ul class="m-0 list-none p-0">
		{#each repos as r (r.fullName)}
			{@const mark = languageMark(r.language)}
			<li class="flex items-center gap-3.5 border-t border-outline-var py-1">
				<span
					aria-hidden="true"
					class="size-3 flex-none"
					style:border-radius={mark.radius}
					style:background={mark.color}
				></span>
				<span class="mono min-w-0 flex-1 truncate text-sm">{r.name}</span>
				<span class="hidden w-[92px] text-[13px] text-on-var sm:block" title={live && r.pushedAt ? `Pushed ${timeAgo(r.pushedAt)}` : undefined}
					>{r.language ?? '—'}</span
				>
				<a class="ib" href={r.url} aria-label="Open {r.name} on GitHub" target="_blank" rel="noopener"
					><ArrowUpRight class="icon" aria-hidden="true" /></a
				>
			</li>
		{/each}
	</ul>
</div>
