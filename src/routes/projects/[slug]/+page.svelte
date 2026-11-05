<script lang="ts">
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Download from '@lucide/svelte/icons/download';
	import Star from '@lucide/svelte/icons/star';
	import { createQuery } from '@tanstack/svelte-query';
	import { dev } from '$app/env';
	import Blob from '#lib/components/Blob.svelte';
	import BrandIcon from '#lib/components/BrandIcon.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Markdown from '#lib/components/Markdown.svelte';
	import ProjectGlyph from '#lib/components/ProjectGlyph.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { tones } from '#lib/components/tones.ts';
	import { hasContent, type Section } from '#lib/content/types.ts';
	import { formatTimeAgo } from '#lib/format.ts';
	import { githubQueries } from '#lib/github/queries.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const project = $derived(data.project);
	const projectPage = $derived(data.page);
	const tone = $derived(tones[project.tone]);

	const repoQuery = createQuery(() => githubQueries.repository(project.githubFullName));
	const releaseQuery = createQuery(() => githubQueries.latestRelease(project.githubFullName));

	// Keep section numbering and navigation aligned; include unfinished Markdown sections in development.
	const contentSections = $derived(projectPage.sections);
	const isSectionVisible = (section: Section, hasExtraContent = false) =>
		hasExtraContent || hasContent(section) || (dev && section.title !== '');
	const sections = $derived(
		[
			{ id: 'overview', label: 'Overview', show: true },
			{ id: 'screens', label: 'Screenshots', show: projectPage.screenshots.length > 0 || dev },
			{ id: 'stack', label: 'Stack', show: projectPage.stack.length > 0 },
			{ id: 'features', label: 'Features', show: isSectionVisible(contentSections.features) },
			{ id: 'arch', label: 'Architecture', show: isSectionVisible(contentSections.architecture, !!projectPage.diagram) },
			{ id: 'challenges', label: 'Challenges', show: isSectionVisible(contentSections.challenges) },
			{ id: 'status', label: 'Status', show: isSectionVisible(contentSections.status, !!projectPage.status) },
			{ id: 'links', label: 'Links', show: true }
		].filter((section) => section.show)
	);
	const getSectionNumber = (id: string) => String(sections.findIndex((section) => section.id === id) + 1).padStart(2, '0');
	const hasSection = (id: string) => sections.some((section) => section.id === id);
</script>

<SeoHead title={project.title} description={project.blurb} />

{#snippet heading(id: string, label: string, row = true)}
	<h2
		class="disp m-0 flex items-center gap-3.5 text-[28px] {row ? 'flex-[1_1_220px] self-start' : ''}"
	>
		<span class="num">{getSectionNumber(id)}</span>{label}
	</h2>
{/snippet}

<div class="main-pad gap-12">
	<nav aria-label="Breadcrumb" class="-mb-4 flex items-center gap-1 text-sm text-on-var">
		<a class="toc pl-2.5" href="/projects"><ArrowLeft class="size-[18px]" aria-hidden="true" />Projects</a>
		<span aria-hidden="true">/</span><span aria-current="page" class="px-3 text-on">{project.title}</span>
	</nav>

	<section class="flex flex-wrap items-center gap-9">
		<div class="relative flex size-[168px] flex-none items-center justify-center" style:color={tone.ink}>
			{#if project.shape === 'arch'}
				<span
					class="absolute inset-x-1 top-3 bottom-0 rounded-[999px_999px_36px_36px]"
					style:background={tone.fill}
					aria-hidden="true"
				></span>
			{:else}
				<Blob shape={project.shape} fill={tone.fill} class="absolute inset-0 size-full" />
			{/if}
			<ProjectGlyph glyph={project.glyph} class="relative size-14" style="stroke-width:1.5" />
		</div>
		<div class="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
			<h1 class="disp m-0 text-[clamp(48px,6.5vw,84px)] leading-[0.98]">
				{#each project.title.split(' ') as word, i (i)}<span class="stretch">{word}</span>{' '}{/each}
			</h1>
			<p class="m-0 max-w-[58ch] text-[19px] text-pretty text-on-var">{project.blurb}</p>
			<div class="flex flex-wrap gap-3 pt-1">
				<a class="btn filled" href={project.repo} target="_blank" rel="noopener"><BrandIcon name="github" />View on GitHub</a>
				{#if project.download}
					<a class="btn tonal" href={project.download.href} target="_blank" rel="noopener"
						><Download class="icon" aria-hidden="true" />{project.download.label}</a
					>
				{/if}
			</div>
			{#if repoQuery.data}
				<p class="mono m-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-var">
					<span class="inline-flex items-center gap-1"
						><Star class="size-3.5" aria-hidden="true" />{repoQuery.data.stars}
						<span class="sr">stars</span></span
					>
					<span>Updated {formatTimeAgo(repoQuery.data.pushedAt)}</span>
					{#if releaseQuery.data}
						<a href={releaseQuery.data.url} target="_blank" rel="noopener">Latest release {releaseQuery.data.tag}</a>
					{/if}
				</p>
			{/if}
		</div>
	</section>

	{#if projectPage.facts.length || projectPage.status}
		<dl class="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
			{#each projectPage.facts as fact (fact.label)}
				<div class="card flex flex-col gap-0.5 rounded-3xl px-[22px] py-[18px]">
					<dt class="text-[13px] text-on-var">{fact.label}</dt>
					<dd class="m-0 text-[17px] font-[650]">{fact.value}</dd>
				</div>
			{/each}
			{#if projectPage.status}
				<div class="card flex flex-col gap-0.5 rounded-3xl bg-pri-c px-[22px] py-[18px] text-on-pri-c">
					<dt class="text-[13px]">Status</dt>
					<dd class="m-0 text-[17px] font-[650]">{projectPage.status}</dd>
				</div>
			{/if}
		</dl>
	{/if}

	<nav aria-label="On this page" class="card flex flex-wrap gap-0.5 rounded-[28px] bg-s-low p-1.5">
		{#each sections as section (section.id)}
			<a class="toc" href="#{section.id}"><b>{getSectionNumber(section.id)}</b>{section.label}</a>
		{/each}
	</nav>

	<section id="overview" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('overview', 'Overview')}
		<div class="md flex min-w-0 flex-[3_1_480px] flex-col gap-3.5 text-[17px]">
			<Markdown blocks={contentSections.intro.blocks} />
		</div>
	</section>

	{#if hasSection('screens')}
		{@const shots = projectPage.screenshots}
		{@const hints = projectPage.screenshotHints ?? ['Main screenshot', 'Detail', 'Detail']}
		<section id="screens" class="flex flex-col gap-[18px]">
			{@render heading('screens', 'Screenshots', false)}
			<div class="flex flex-wrap gap-4">
				<div class="shot min-h-[360px] flex-[2_1_480px] rounded-[32px_32px_32px_12px]">
					{#if shots[0]}<img src={shots[0].src} alt={shots[0].alt} loading="lazy" />{:else}[{hints[0]}]{/if}
				</div>
				{#if shots[1] || shots[2] || dev}
				<div class="flex flex-[1_1_260px] flex-col gap-4">
					{#if shots[1] || dev}
					<div class="shot min-h-[172px] flex-1 rounded-[120px_120px_24px_24px]">
						{#if shots[1]}<img src={shots[1].src} alt={shots[1].alt} loading="lazy" />{:else}[{hints[1]}]{/if}
					</div>
					{/if}
					{#if shots[2] || dev}
					<div class="shot min-h-[172px] flex-1 rounded-3xl">
						{#if shots[2]}<img src={shots[2].src} alt={shots[2].alt} loading="lazy" />{:else}[{hints[2]}]{/if}
					</div>
					{/if}
				</div>
				{/if}
			</div>
		</section>
	{/if}

	{#if hasSection('stack')}
	<section id="stack" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('stack', 'Technical stack')}
		<div class="grid min-w-0 flex-[3_1_480px] grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
			{#each projectPage.stack as stackGroup (stackGroup.label)}
				<div class="card flex flex-col gap-2.5 rounded-3xl px-5 py-[18px]">
					<span class="text-sm font-semibold">{stackGroup.label}</span>
					<span class="flex flex-wrap gap-1.5">{#each stackGroup.items as technology (technology)}<span class="chip">{technology}</span>{/each}</span>
				</div>
			{/each}
		</div>
	</section>
	{/if}

	{#if hasSection('features')}
		<section id="features" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('features', 'Features')}
			<div class="md flex min-w-0 flex-[3_1_480px] flex-col gap-3.5 text-[17px]">
				<Markdown blocks={contentSections.features.blocks} lists="features" />
			</div>
		</section>
	{/if}

	{#if hasSection('arch')}
		<section id="arch" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('arch', 'Architecture')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-[18px]">
				<div class="md flex flex-col gap-3.5 text-[17px]"><Markdown blocks={contentSections.architecture.blocks} /></div>
				{#if projectPage.diagram}
					{@const diagram = projectPage.diagram}
						<figure
							class="card m-0 flex flex-col items-center border border-outline-var bg-s-low px-5 py-8"
							role="img"
							aria-label={diagram.label}
						>
							<div class="box w-[min(360px,100%)] rounded-full bg-pri-c text-on-pri-c">
								<span class="mono text-[15px] font-medium">{diagram.top.name}</span><span class="text-[13px]"
									>{diagram.top.note}</span
								>
							</div>
							<svg viewBox="0 0 240 40" aria-hidden="true" class="h-10 w-[min(240px,70%)]" fill="none" stroke="var(--outline)" stroke-width="1.8" stroke-linecap="round">
								<path d="M120 0v14M120 14H40v22M120 14h80v22" /><path d="m35 31 5 6 5-6M195 31l5 6 5-6" />
							</svg>
							<div class="flex w-[min(480px,100%)] gap-6">
								{#each diagram.middle as node, nodeIndex (node.name)}
									<div
										class="box flex-1"
										class:bg-sand-c={nodeIndex % 2 === 0}
										class:text-on-sand-c={nodeIndex % 2 === 0}
										class:bg-rose-c={nodeIndex % 2 === 1}
										class:text-on-rose-c={nodeIndex % 2 === 1}
									>
										<span class="mono text-[15px] font-medium">{node.name}</span><span class="text-[13px]">{node.note}</span>
									</div>
								{/each}
							</div>
							<svg viewBox="0 0 240 40" aria-hidden="true" class="h-10 w-[min(240px,70%)]" fill="none" stroke="var(--outline)" stroke-width="1.8" stroke-linecap="round">
								<path d="M40 0v12H200V0M120 12v24" /><path d="m115 31 5 6 5-6" />
							</svg>
							<div class="box w-[min(360px,100%)] rounded-[999px_999px_20px_20px] bg-ter-c text-on-ter-c">
								<span class="mono text-[15px] font-medium">{diagram.bottom.name}</span><span class="text-[13px]"
									>{diagram.bottom.note}</span
								>
							</div>
						</figure>
				{/if}
			</div>
		</section>
	{/if}

	{#if hasSection('challenges')}
		<section id="challenges" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('challenges', 'Challenges')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-3">
				<div class="md flex flex-col gap-3.5 text-[17px]"><Markdown blocks={contentSections.challenges.blocks} /></div>
				{#each contentSections.challenges.parts as challenge (challenge.title)}
					<div class="md card flex flex-col gap-2 px-6 py-[22px]">
						<h3 class="m-0 text-lg font-[650]">{challenge.title}</h3>
						<div class="flex flex-col gap-2 text-on-var"><Markdown blocks={challenge.blocks} /></div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if hasSection('status')}
		<section id="status" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('status', 'Status')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-3 text-[17px]">
				{#if projectPage.status}
					<span
						class="inline-flex h-9 items-center gap-2 self-start rounded-[18px] bg-pri-c px-4 text-sm font-semibold text-on-pri-c"
						>{projectPage.status}</span
					>
				{/if}
				<div class="md flex flex-col gap-3.5"><Markdown blocks={contentSections.status.blocks} /></div>
			</div>
		</section>
	{/if}

	<section id="links" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('links', 'Links')}
		<div class="grid min-w-0 flex-[3_1_480px] grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3">
			{#each projectPage.links as link (link.href)}
				<a class="card hov flex flex-col gap-0.5 px-[22px] py-[18px] text-on" href={link.href} target="_blank" rel="noopener">
					<span class="font-[650]">{link.label}</span><span class="mono text-xs text-on-var">{link.caption}</span>
				</a>
			{/each}
			{#if releaseQuery.data}
				<a class="card hov flex flex-col gap-0.5 px-[22px] py-[18px] text-on" href={releaseQuery.data.url} target="_blank" rel="noopener">
					<span class="font-[650]">Releases</span><span class="mono text-xs text-on-var"
						>{releaseQuery.data.name} · {formatTimeAgo(releaseQuery.data.publishedAt)}</span
					>
				</a>
			{/if}
		</div>
	</section>

	<nav aria-label="More projects" class="flex flex-wrap justify-between gap-3 pt-2">
		<a class="btn outlined" href="/projects"><ArrowLeft class="icon" aria-hidden="true" />All projects</a>
		<a class="btn tonal" href="/projects/{data.nextProject.slug}"
			>Next up: {data.nextProject.title}<ArrowRight class="icon" aria-hidden="true" /></a
		>
	</nav>

	<Footer />
</div>
