<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { createQuery } from '@tanstack/svelte-query';
	import { githubQueries } from '#lib/github/queries.ts';
	import type { Repository } from '#lib/github/api.ts';
	import { getLanguageMarker, formatTimeAgo } from '#lib/format.ts';

	/** Shown while loading (and in the prerendered HTML) so the card never looks empty. */
	const PLACEHOLDER_REPOSITORIES: Repository[] = [
		['The-Mystora-Project', 'WoodenAccentsMod', 'Kotlin'],
		['Mystery2099', 'capstone-ticket-system', 'TypeScript'],
		['Mystery2099', 'alfred-go', 'TypeScript'],
		['The-Mystora-Project', 'VoxLib', 'Kotlin'],
		['Mystery2099', 'happycms', 'PHP']
	].map(([owner, name, language]) => ({
		name,
		fullName: `${owner}/${name}`,
		url: `https://github.com/${owner}/${name}`,
		description: null,
		language,
		stars: 0,
		pushedAt: '',
		isFork: false,
		isArchived: false
	}));

	const recentQuery = createQuery(() => ({
		...githubQueries.recentRepositories(),
		placeholderData: PLACEHOLDER_REPOSITORIES
	}));
	const repositories = $derived(recentQuery.data ?? PLACEHOLDER_REPOSITORIES);
	const isLive = $derived(recentQuery.isSuccess && !recentQuery.isPlaceholderData);
</script>

<div class="card min-w-0 flex-[2_1_440px] px-6 pt-6 pb-3">
	<div class="mb-1.5 flex items-center justify-between gap-3">
		<h3 class="m-0 text-lg font-[650]">Recently updated</h3>
		<span class="mono text-xs text-on-var" aria-live="polite">
			{#if recentQuery.isError}cached list{:else if isLive}from GitHub{:else}from GitHub…{/if}
		</span>
	</div>
	<ul class="m-0 list-none p-0">
		{#each repositories as repository (repository.fullName)}
			{@const marker = getLanguageMarker(repository.language)}
			<li class="flex items-center gap-3.5 border-t border-outline-var py-1">
				<span
					aria-hidden="true"
					class="size-3 flex-none"
					style:border-radius={marker.radius}
					style:background={marker.color}
				></span>
				<span class="mono min-w-0 flex-1 truncate text-sm">{repository.name}</span>
				<span
					class="hidden w-[92px] text-[13px] text-on-var sm:block"
					title={isLive && repository.pushedAt ? `Pushed ${formatTimeAgo(repository.pushedAt)}` : undefined}
					>{repository.language ?? '—'}</span
				>
				<a class="ib" href={repository.url} aria-label="Open {repository.name} on GitHub" target="_blank" rel="noopener"
					><ArrowUpRight class="icon" aria-hidden="true" /></a
				>
			</li>
		{/each}
	</ul>
</div>
