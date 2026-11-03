<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Check from '@lucide/svelte/icons/check';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import List from '@lucide/svelte/icons/list';
	import Search from '@lucide/svelte/icons/search';
	import { afterNavigate, goto } from '$app/navigation';
	import Blob from '#lib/components/Blob.svelte';
	import BrandIcon from '#lib/components/BrandIcon.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import ProjectTable from '#lib/components/ProjectTable.svelte';
	import ProjectTile from '#lib/components/ProjectTile.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import {
		categories,
		littleMods,
		projectHref,
		projects,
		projectSearchText,
		techFilters,
		type CategoryId,
		type Tech
	} from '#lib/data/projects.ts';
	import { prefs } from '#lib/state/prefs.svelte.ts';

	let q = $state('');
	let cat = $state<CategoryId | 'all'>('all');
	let tech = $state<Tech | ''>('');

	// Filters live in the URL (?q=&cat=&tech=) so they can be shared and the
	// command palette can deep-link to "/projects?tech=Kotlin". Pages are
	// prerendered, so the URL is only read in the browser.
	const toSearch = () => {
		const params = new URLSearchParams();
		if (q.trim()) params.set('q', q.trim());
		if (cat !== 'all') params.set('cat', cat);
		if (tech) params.set('tech', tech);
		return params.size ? `?${params}` : '';
	};

	// Don't write state back to the URL until the URL has been read once.
	let urlRead = $state(false);

	afterNavigate(({ to }) => {
		urlRead = true;
		const url = to?.url;
		if (!url || url.search === toSearch()) return;
		const params = url.searchParams;
		q = params.get('q') ?? '';
		const c = params.get('cat');
		cat = categories.some((x) => x.id === c) ? (c as CategoryId) : 'all';
		const t = params.get('tech');
		tech = techFilters.includes(t as Tech) ? (t as Tech) : '';
	});

	$effect(() => {
		const search = toSearch();
		if (urlRead && search !== location.search) {
			goto(`/projects${search}`, { shallow: true, replace: true });
		}
	});

	const ql = $derived(q.trim().toLowerCase());
	const shown = $derived(
		projects.filter(
			(p) =>
				(!ql || projectSearchText(p).includes(ql)) &&
				(!tech || p.techs.includes(tech)) &&
				(cat === 'all' || p.cat === cat)
		)
	);
	const showSmall = $derived(
		(cat === 'all' || cat === littleMods.cat) && !tech && (!ql || littleMods.searchText.includes(ql))
	);
	const primary = $derived(shown.filter((p) => p.primary));
	const secondary = $derived(shown.filter((p) => !p.primary));
	const isEmpty = $derived(shown.length === 0 && !showSmall);
	const filtered = $derived(!!(ql || tech || cat !== 'all'));
	const counts = Object.fromEntries(
		categories.map((c) => [c.id, c.id === 'all' ? projects.length : projects.filter((p) => p.cat === c.id).length])
	);

	function clearAll() {
		q = '';
		tech = '';
		cat = 'all';
	}
</script>

<SeoHead title="Projects" description="Selected projects by Mathew Kennedy-Brewer: web apps, developer tools and Minecraft mods." />

<div class="main-pad gap-9">
	<section class="flex flex-col gap-3">
		<h1 class="disp m-0 text-[clamp(48px,6vw,80px)] leading-none"><span class="stretch">Projects</span></h1>
		<p class="m-0 max-w-[58ch] text-[19px] text-on-var">
			Some of the projects I've worked on, <span class="wavy">not every repository</span> on my GitHub. You can search, or
			filter by the kind of project and the technologies used.
		</p>
	</section>

	<section aria-label="Project filters" class="flex flex-col gap-4">
		<div class="flex flex-wrap items-center gap-3">
			<div class="search flex-[1_1_320px]">
				<Search class="icon" aria-hidden="true" />
				<label for="proj-q" class="sr">Search projects</label>
				<input id="proj-q" type="search" placeholder="Search, try “Fabric” or “SQLite”" bind:value={q} autocomplete="off" />
			</div>
			<div class="seg" role="group" aria-label="View">
				<button
					type="button"
					class:on={prefs.projectView === 'cards'}
					aria-pressed={prefs.projectView === 'cards'}
					onclick={() => (prefs.projectView = 'cards')}
				>
					<LayoutGrid class="size-[18px]" aria-hidden="true" />Cards
				</button>
				<button
					type="button"
					class:on={prefs.projectView === 'list'}
					aria-pressed={prefs.projectView === 'list'}
					onclick={() => (prefs.projectView = 'list')}
				>
					<List class="size-[18px]" aria-hidden="true" />List
				</button>
			</div>
		</div>
		<div role="group" aria-label="Category" class="flex flex-wrap gap-2">
			{#each categories as c (c.id)}
				<button type="button" class="fchip" class:on={cat === c.id} aria-pressed={cat === c.id} onclick={() => (cat = c.id)}>
					{#if cat === c.id}<Check class="size-[18px]" aria-hidden="true" />{/if}{c.label}<span class="n"
						>{counts[c.id]}</span
					>
				</button>
			{/each}
		</div>
		<div role="group" aria-label="Technology" class="flex flex-wrap items-center gap-2">
			<span class="mr-1 text-sm text-on-var">Built with</span>
			{#each techFilters as t (t)}
				<button
					type="button"
					class="fchip t"
					class:on={tech === t}
					aria-pressed={tech === t}
					onclick={() => (tech = tech === t ? '' : t)}>{t}</button
				>
			{/each}
		</div>
		<div class="flex min-h-11 flex-wrap items-center justify-between gap-3">
			<span role="status" class="text-sm text-on-var">Showing {shown.length} of {projects.length}</span>
			{#if filtered}
				<button type="button" class="btn outlined h-10 px-4" onclick={clearAll}>Clear filters</button>
			{/if}
		</div>
	</section>

	{#if isEmpty}
		<div class="card flex flex-col items-center gap-3.5 px-6 py-14 text-center">
			<Blob shape="clover" fill="var(--ter-c)" class="size-24" />
			<span class="disp text-[26px]">Nothing matches that</span>
			<p class="m-0 max-w-[44ch] text-on-var">
				None of my projects match those filters. Try a different technology, or clear the filters to see everything.
			</p>
			<button type="button" class="btn filled" onclick={clearAll}>Clear filters</button>
		</div>
	{:else if prefs.projectView === 'list'}
		{#if shown.length}<ProjectTable projects={shown} />{/if}
	{:else}
		<div class="flex flex-col gap-12">
			{#if primary.length}
				<section aria-labelledby="prim-h" class="flex flex-col gap-5">
					<h2 id="prim-h" class="disp m-0 text-[30px]">Main projects</h2>
					<div class="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
						{#each primary as p (p.slug)}
							<article class="card hov flex flex-col gap-3.5 p-7">
								<div class="flex items-start justify-between gap-3">
									<ProjectTile project={p} />
									<a class="ib" href={p.repo} aria-label="{p.title} on GitHub" target="_blank" rel="noopener"
										><BrandIcon name="github" /></a
									>
								</div>
								<h3 class="disp m-0 text-[28px]">{p.title}</h3>
								<span class="-mt-2 text-sm font-semibold text-ter">{p.catLabel}</span>
								<p class="m-0 text-on-var">{p.blurb}</p>
								<div class="mt-auto flex flex-wrap gap-2">
									{#each p.stack as s (s)}<span class="chip">{s}</span>{/each}
								</div>
								<a class="btn tonal sm self-start" href={projectHref(p)} aria-label="{p.title} details"
									>Details<ArrowRight class="size-[18px]" aria-hidden="true" /></a
								>
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if secondary.length || showSmall}
				<section aria-labelledby="sec-h" class="flex flex-col gap-5">
					<h2 id="sec-h" class="disp m-0 text-[30px]">Smaller projects</h2>
					<div class="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
						{#each secondary as p (p.slug)}
							<article class="card flex flex-col gap-2.5 border border-outline-var bg-s-low px-6 py-[22px]">
								<div class="flex items-center justify-between gap-2">
									<h3 class="disp m-0 text-[22px]">{p.title}</h3>
									<a class="ib -mr-2" href={p.repo} aria-label="{p.title} on GitHub" target="_blank" rel="noopener"
										><ArrowUpRight class="icon" aria-hidden="true" /></a
									>
								</div>
								<p class="m-0 text-[15px] text-on-var">{p.blurb}</p>
								{#if p.note}
									<span class="self-start rounded-lg bg-sand-c px-2.5 py-1 text-[13px] font-medium text-on-sand-c"
										>{p.note}</span
									>
								{/if}
								<div class="flex flex-wrap gap-2">
									{#each p.stack as s (s)}<span class="chip">{s}</span>{/each}
								</div>
								{#if p.hasPage}
									<a class="btn tonal sm mt-1 self-start" href={projectHref(p)} aria-label="{p.title} details"
										>Details<ArrowRight class="size-[18px]" aria-hidden="true" /></a
									>
								{/if}
							</article>
						{/each}
						{#if showSmall}
							<article class="card flex flex-col gap-2.5 border border-outline-var bg-s-low px-6 py-[22px]">
								<h3 class="disp m-0 text-[22px]">{littleMods.title}</h3>
								<p class="m-0 text-[15px] text-on-var">{littleMods.blurb}</p>
								<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
									{#each littleMods.items as m (m)}<li class="chip rounded-2xl">{m}</li>{/each}
								</ul>
							</article>
						{/if}
					</div>
				</section>
			{/if}
		</div>
	{/if}

	<div class="pt-4"><Footer /></div>
</div>
