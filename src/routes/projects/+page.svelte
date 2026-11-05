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
		smallMinecraftMods,
		getProjectHref,
		projects,
		getProjectSearchText,
		techFilters,
		type CategoryId,
		type Tech
	} from '#lib/data/projects.ts';
	import { preferences } from '#lib/state/preferences.svelte.ts';

	let query = $state('');
	let selectedCategory = $state<CategoryId | 'all'>('all');
	let selectedTechnology = $state<Tech | ''>('');

	// Filters live in the URL (?q=&cat=&tech=) so they can be shared and the
	// command palette can deep-link to "/projects?tech=Kotlin". Pages are
	// prerendered, so the URL is only read in the browser.
	const getFilterSearch = () => {
		const params = new URLSearchParams();
		if (query.trim()) params.set('q', query.trim());
		if (selectedCategory !== 'all') params.set('cat', selectedCategory);
		if (selectedTechnology) params.set('tech', selectedTechnology);
		return params.size ? `?${params}` : '';
	};

	// Don't write state back to the URL until the URL has been read once.
	let hasReadUrl = $state(false);

	afterNavigate(({ to }) => {
		hasReadUrl = true;
		const url = to?.url;
		if (!url || url.search === getFilterSearch()) return;
		const params = url.searchParams;
		query = params.get('q') ?? '';
		const categoryId = params.get('cat');
		selectedCategory = categories.some((category) => category.id === categoryId) ? (categoryId as CategoryId) : 'all';
		const technology = params.get('tech');
		selectedTechnology = techFilters.includes(technology as Tech) ? (technology as Tech) : '';
	});

	$effect(() => {
		const search = getFilterSearch();
		if (hasReadUrl && search !== location.search) {
			goto(`/projects${search}`, { shallow: true, replace: true });
		}
	});

	const normalizedQuery = $derived(query.trim().toLowerCase());
	const filteredProjects = $derived(
		projects.filter(
			(project) =>
				(!normalizedQuery || getProjectSearchText(project).includes(normalizedQuery)) &&
				(!selectedTechnology || project.techs.includes(selectedTechnology)) &&
				(selectedCategory === 'all' || project.category === selectedCategory)
		)
	);
	const showSmallMinecraftMods = $derived(
		(selectedCategory === 'all' || selectedCategory === smallMinecraftMods.category) &&
		!selectedTechnology &&
		(!normalizedQuery || smallMinecraftMods.searchText.includes(normalizedQuery))
	);
	const primaryProjects = $derived(filteredProjects.filter((project) => project.isPrimary));
	const secondaryProjects = $derived(filteredProjects.filter((project) => !project.isPrimary));
	const isEmpty = $derived(filteredProjects.length === 0 && !showSmallMinecraftMods);
	const hasFilters = $derived(!!(normalizedQuery || selectedTechnology || selectedCategory !== 'all'));
	const categoryCounts = Object.fromEntries(
		categories.map((category) => [category.id, category.id === 'all' ? projects.length : projects.filter((project) => project.category === category.id).length])
	);

	function clearFilters() {
		query = '';
		selectedTechnology = '';
		selectedCategory = 'all';
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
				<input id="proj-q" type="search" placeholder="Search, try “Fabric” or “SQLite”" bind:value={query} autocomplete="off" />
			</div>
			<div class="seg" role="group" aria-label="View">
				<button
					type="button"
					class:on={preferences.projectView === 'cards'}
					aria-pressed={preferences.projectView === 'cards'}
					onclick={() => (preferences.projectView = 'cards')}
				>
					<LayoutGrid class="size-[18px]" aria-hidden="true" />Cards
				</button>
				<button
					type="button"
					class:on={preferences.projectView === 'list'}
					aria-pressed={preferences.projectView === 'list'}
					onclick={() => (preferences.projectView = 'list')}
				>
					<List class="size-[18px]" aria-hidden="true" />List
				</button>
			</div>
		</div>
		<div role="group" aria-label="Category" class="flex flex-wrap gap-2">
			{#each categories as category (category.id)}
				<button type="button" class="fchip" class:on={selectedCategory === category.id} aria-pressed={selectedCategory === category.id} onclick={() => (selectedCategory = category.id)}>
					{#if selectedCategory === category.id}<Check class="size-[18px]" aria-hidden="true" />{/if}{category.label}<span class="n"
						>{categoryCounts[category.id]}</span
					>
				</button>
			{/each}
		</div>
		<div role="group" aria-label="Technology" class="flex flex-wrap items-center gap-2">
			<span class="mr-1 text-sm text-on-var">Built with</span>
			{#each techFilters as technology (technology)}
				<button
					type="button"
					class="fchip t"
					class:on={selectedTechnology === technology}
					aria-pressed={selectedTechnology === technology}
					onclick={() => (selectedTechnology = selectedTechnology === technology ? '' : technology)}>{technology}</button
				>
			{/each}
		</div>
		<div class="flex min-h-11 flex-wrap items-center justify-between gap-3">
			<span role="status" class="text-sm text-on-var">Showing {filteredProjects.length} of {projects.length}</span>
			{#if hasFilters}
				<button type="button" class="btn outlined h-10 px-4" onclick={clearFilters}>Clear filters</button>
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
			<button type="button" class="btn filled" onclick={clearFilters}>Clear filters</button>
		</div>
	{:else if preferences.projectView === 'list'}
		{#if filteredProjects.length}<ProjectTable projects={filteredProjects} />{/if}
	{:else}
		<div class="flex flex-col gap-12">
			{#if primaryProjects.length}
				<section aria-labelledby="prim-h" class="flex flex-col gap-5">
					<h2 id="prim-h" class="disp m-0 text-[30px]">Main projects</h2>
					<div class="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
						{#each primaryProjects as project (project.slug)}
							<article class="card hov flex flex-col gap-3.5 p-7">
								<div class="flex items-start justify-between gap-3">
									<ProjectTile project={project} />
									<a class="ib" href={project.repo} aria-label="{project.title} on GitHub" target="_blank" rel="noopener"
										><BrandIcon name="github" /></a
									>
								</div>
								<h3 class="disp m-0 text-[28px]">{project.title}</h3>
								<span class="-mt-2 text-sm font-semibold text-ter">{project.categoryLabel}</span>
								<p class="m-0 text-on-var">{project.blurb}</p>
								<div class="mt-auto flex flex-wrap gap-2">
									{#each project.stack as technology (technology)}<span class="chip">{technology}</span>{/each}
								</div>
								<a class="btn tonal sm self-start" href={getProjectHref(project)} aria-label="{project.title} details"
									>Details<ArrowRight class="size-[18px]" aria-hidden="true" /></a
								>
							</article>
						{/each}
					</div>
				</section>
			{/if}

			{#if secondaryProjects.length || showSmallMinecraftMods}
				<section aria-labelledby="sec-h" class="flex flex-col gap-5">
					<h2 id="sec-h" class="disp m-0 text-[30px]">Smaller projects</h2>
					<div class="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
						{#each secondaryProjects as project (project.slug)}
							<article class="card flex flex-col gap-2.5 border border-outline-var bg-s-low px-6 py-[22px]">
								<div class="flex items-center justify-between gap-2">
									<h3 class="disp m-0 text-[22px]">{project.title}</h3>
									<a class="ib -mr-2" href={project.repo} aria-label="{project.title} on GitHub" target="_blank" rel="noopener"
										><ArrowUpRight class="icon" aria-hidden="true" /></a
									>
								</div>
								<p class="m-0 text-[15px] text-on-var">{project.blurb}</p>
								{#if project.note}
									<span class="self-start rounded-lg bg-sand-c px-2.5 py-1 text-[13px] font-medium text-on-sand-c"
										>{project.note}</span
									>
								{/if}
								<div class="flex flex-wrap gap-2">
									{#each project.stack as technology (technology)}<span class="chip">{technology}</span>{/each}
								</div>
								{#if project.hasPage}
									<a class="btn tonal sm mt-1 self-start" href={getProjectHref(project)} aria-label="{project.title} details"
										>Details<ArrowRight class="size-[18px]" aria-hidden="true" /></a
									>
								{/if}
							</article>
						{/each}
						{#if showSmallMinecraftMods}
							<article class="card flex flex-col gap-2.5 border border-outline-var bg-s-low px-6 py-[22px]">
								<h3 class="disp m-0 text-[22px]">{smallMinecraftMods.title}</h3>
								<p class="m-0 text-[15px] text-on-var">{smallMinecraftMods.blurb}</p>
								<ul class="m-0 flex list-none flex-wrap gap-2 p-0">
									{#each smallMinecraftMods.items as modName (modName)}<li class="chip rounded-2xl">{modName}</li>{/each}
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
