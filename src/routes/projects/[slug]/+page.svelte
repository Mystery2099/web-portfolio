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
	const p = $derived(data.project);
	const d = $derived(data.detail);
	const tone = $derived(tones[p.tone]);

	const repoQuery = createQuery(() => githubQueries.repository(p.githubRepo));
	const releaseQuery = createQuery(() => githubQueries.latestRelease(p.githubRepo));

	// Sections with no content are dropped in production (and flagged in dev),
	// so numbering and the table of contents always line up.
	// A section shows once it has real content. In dev it also shows while it only
	// holds TODOs, as long as its heading is in the Markdown file.
	const md = $derived(d.sections);
	const visible = (s: Section, extra = false) => extra || hasContent(s) || (dev && s.title !== '');
	const sections = $derived(
		[
			{ id: 'overview', label: 'Overview', show: true },
			{ id: 'screens', label: 'Screenshots', show: d.screenshots.length > 0 || dev },
			{ id: 'stack', label: 'Stack', show: d.stack.length > 0 },
			{ id: 'features', label: 'Features', show: visible(md.features) },
			{ id: 'arch', label: 'Architecture', show: visible(md.architecture, !!d.diagram) },
			{ id: 'challenges', label: 'Challenges', show: visible(md.challenges) },
			{ id: 'status', label: 'Status', show: visible(md.status, !!d.status) },
			{ id: 'links', label: 'Links', show: true }
		].filter((s) => s.show)
	);
	const num = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, '0');
	const has = (id: string) => sections.some((s) => s.id === id);
</script>

<SeoHead title={p.title} description={p.blurb} />

{#snippet heading(id: string, label: string, row = true)}
	<h2
		class="disp m-0 flex items-center gap-3.5 text-[28px] {row ? 'flex-[1_1_220px] self-start' : ''}"
	>
		<span class="num">{num(id)}</span>{label}
	</h2>
{/snippet}

<div class="main-pad gap-12">
	<nav aria-label="Breadcrumb" class="-mb-4 flex items-center gap-1 text-sm text-on-var">
		<a class="toc pl-2.5" href="/projects"><ArrowLeft class="size-[18px]" aria-hidden="true" />Projects</a>
		<span aria-hidden="true">/</span><span aria-current="page" class="px-3 text-on">{p.title}</span>
	</nav>

	<section class="flex flex-wrap items-center gap-9">
		<div class="relative flex size-[168px] flex-none items-center justify-center" style:color={tone.ink}>
			{#if p.shape === 'arch'}
				<span
					class="absolute inset-x-1 top-3 bottom-0 rounded-[999px_999px_36px_36px]"
					style:background={tone.fill}
					aria-hidden="true"
				></span>
			{:else}
				<Blob shape={p.shape} fill={tone.fill} class="absolute inset-0 size-full" />
			{/if}
			<ProjectGlyph glyph={p.glyph} class="relative size-14" style="stroke-width:1.5" />
		</div>
		<div class="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
			<h1 class="disp m-0 text-[clamp(48px,6.5vw,84px)] leading-[0.98]">
				{#each p.title.split(' ') as word, i (i)}<span class="stretch">{word}</span>{' '}{/each}
			</h1>
			<p class="m-0 max-w-[58ch] text-[19px] text-pretty text-on-var">{p.blurb}</p>
			<div class="flex flex-wrap gap-3 pt-1">
				<a class="btn filled" href={p.repo} target="_blank" rel="noopener"><BrandIcon name="github" />View on GitHub</a>
				{#if p.download}
					<a class="btn tonal" href={p.download.href} target="_blank" rel="noopener"
						><Download class="icon" aria-hidden="true" />{p.download.label}</a
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

	{#if d.facts.length || d.status}
		<dl class="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
			{#each d.facts as f (f.label)}
				<div class="card flex flex-col gap-0.5 rounded-3xl px-[22px] py-[18px]">
					<dt class="text-[13px] text-on-var">{f.label}</dt>
					<dd class="m-0 text-[17px] font-[650]">{f.value}</dd>
				</div>
			{/each}
			{#if d.status}
				<div class="card flex flex-col gap-0.5 rounded-3xl bg-pri-c px-[22px] py-[18px] text-on-pri-c">
					<dt class="text-[13px]">Status</dt>
					<dd class="m-0 text-[17px] font-[650]">{d.status}</dd>
				</div>
			{/if}
		</dl>
	{/if}

	<nav aria-label="On this page" class="card flex flex-wrap gap-0.5 rounded-[28px] bg-s-low p-1.5">
		{#each sections as s (s.id)}
			<a class="toc" href="#{s.id}"><b>{num(s.id)}</b>{s.label}</a>
		{/each}
	</nav>

	<section id="overview" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('overview', 'Overview')}
		<div class="md flex min-w-0 flex-[3_1_480px] flex-col gap-3.5 text-[17px]">
			<Markdown blocks={md.intro.blocks} />
		</div>
	</section>

	{#if has('screens')}
		{@const shots = d.screenshots}
		{@const hints = d.screenshotHints ?? ['Main screenshot', 'Detail', 'Detail']}
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

	{#if has('stack')}
	<section id="stack" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('stack', 'Technical stack')}
		<div class="grid min-w-0 flex-[3_1_480px] grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
			{#each d.stack as g (g.label)}
				<div class="card flex flex-col gap-2.5 rounded-3xl px-5 py-[18px]">
					<span class="text-sm font-semibold">{g.label}</span>
					<span class="flex flex-wrap gap-1.5">{#each g.items as s (s)}<span class="chip">{s}</span>{/each}</span>
				</div>
			{/each}
		</div>
	</section>
	{/if}

	{#if has('features')}
		<section id="features" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('features', 'Features')}
			<div class="md flex min-w-0 flex-[3_1_480px] flex-col gap-3.5 text-[17px]">
				<Markdown blocks={md.features.blocks} lists="features" />
			</div>
		</section>
	{/if}

	{#if has('arch')}
		<section id="arch" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('arch', 'Architecture')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-[18px]">
				<div class="md flex flex-col gap-3.5 text-[17px]"><Markdown blocks={md.architecture.blocks} /></div>
				{#if d.diagram}
					{@const dg = d.diagram}
						<figure
							class="card m-0 flex flex-col items-center border border-outline-var bg-s-low px-5 py-8"
							role="img"
							aria-label={dg.label}
						>
							<div class="box w-[min(360px,100%)] rounded-full bg-pri-c text-on-pri-c">
								<span class="mono text-[15px] font-medium">{dg.top.name}</span><span class="text-[13px]"
									>{dg.top.note}</span
								>
							</div>
							<svg viewBox="0 0 240 40" aria-hidden="true" class="h-10 w-[min(240px,70%)]" fill="none" stroke="var(--outline)" stroke-width="1.8" stroke-linecap="round">
								<path d="M120 0v14M120 14H40v22M120 14h80v22" /><path d="m35 31 5 6 5-6M195 31l5 6 5-6" />
							</svg>
							<div class="flex w-[min(480px,100%)] gap-6">
								{#each dg.middle as m, i (m.name)}
									<div
										class="box flex-1"
										class:bg-sand-c={i % 2 === 0}
										class:text-on-sand-c={i % 2 === 0}
										class:bg-rose-c={i % 2 === 1}
										class:text-on-rose-c={i % 2 === 1}
									>
										<span class="mono text-[15px] font-medium">{m.name}</span><span class="text-[13px]">{m.note}</span>
									</div>
								{/each}
							</div>
							<svg viewBox="0 0 240 40" aria-hidden="true" class="h-10 w-[min(240px,70%)]" fill="none" stroke="var(--outline)" stroke-width="1.8" stroke-linecap="round">
								<path d="M40 0v12H200V0M120 12v24" /><path d="m115 31 5 6 5-6" />
							</svg>
							<div class="box w-[min(360px,100%)] rounded-[999px_999px_20px_20px] bg-ter-c text-on-ter-c">
								<span class="mono text-[15px] font-medium">{dg.bottom.name}</span><span class="text-[13px]"
									>{dg.bottom.note}</span
								>
							</div>
						</figure>
				{/if}
			</div>
		</section>
	{/if}

	{#if has('challenges')}
		<section id="challenges" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('challenges', 'Challenges')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-3">
				<div class="md flex flex-col gap-3.5 text-[17px]"><Markdown blocks={md.challenges.blocks} /></div>
				{#each md.challenges.parts as c (c.title)}
					<div class="md card flex flex-col gap-2 px-6 py-[22px]">
						<h3 class="m-0 text-lg font-[650]">{c.title}</h3>
						<div class="flex flex-col gap-2 text-on-var"><Markdown blocks={c.blocks} /></div>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if has('status')}
		<section id="status" class="flex flex-wrap gap-x-10 gap-y-4">
			{@render heading('status', 'Status')}
			<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-3 text-[17px]">
				{#if d.status}
					<span
						class="inline-flex h-9 items-center gap-2 self-start rounded-[18px] bg-pri-c px-4 text-sm font-semibold text-on-pri-c"
						>{d.status}</span
					>
				{/if}
				<div class="md flex flex-col gap-3.5"><Markdown blocks={md.status.blocks} /></div>
			</div>
		</section>
	{/if}

	<section id="links" class="flex flex-wrap gap-x-10 gap-y-4">
		{@render heading('links', 'Links')}
		<div class="grid min-w-0 flex-[3_1_480px] grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3">
			{#each d.links as l (l.href)}
				<a class="card hov flex flex-col gap-0.5 px-[22px] py-[18px] text-on" href={l.href} target="_blank" rel="noopener">
					<span class="font-[650]">{l.label}</span><span class="mono text-xs text-on-var">{l.caption}</span>
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
		<a class="btn tonal" href="/projects/{data.next.slug}"
			>Next up: {data.next.title}<ArrowRight class="icon" aria-hidden="true" /></a
		>
	</nav>

	<Footer />
</div>
