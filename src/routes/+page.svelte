<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import FileText from '@lucide/svelte/icons/file-text';
	import Globe from '@lucide/svelte/icons/globe';
	import Monitor from '@lucide/svelte/icons/monitor';
	import Box from '@lucide/svelte/icons/box';
	import Puzzle from '@lucide/svelte/icons/puzzle';
	import Download from '@lucide/svelte/icons/download';
	import Blob from '#lib/components/Blob.svelte';
	import BrandIcon from '#lib/components/BrandIcon.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Markdown from '#lib/components/Markdown.svelte';
	import ProjectTile from '#lib/components/ProjectTile.svelte';
	import RecentRepos from '#lib/components/RecentRepos.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { currentFocus, findProject, getProjectHref, projects, mostUsedTools } from '#lib/data/projects.ts';
	import { site } from '#lib/data/site.ts';
	import * as home from '#content/home.md';

	const featured = projects.filter((project) => project.isFeatured);
	const focus = findProject(currentFocus.slug)!;
</script>

<SeoHead />

<div class="main-pad gap-20">
	<section aria-labelledby="hero-h" class="flex flex-wrap items-center gap-12">
		<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-6">
			<h1 id="hero-h" class="disp m-0 text-[clamp(40px,4.6vw,66px)] leading-[1.02] text-balance">
				<span class="stretch">Mathew</span> <span class="stretch">Kennedy-Brewer</span><br /><span
					class="stretch text-pri">Software</span
				> <span class="stretch text-pri">Developer</span>
			</h1>
			<div class="md md-wavy flex max-w-[58ch] flex-col gap-3.5 text-[19px] text-pretty text-on-var">
				<Markdown blocks={home.intro.blocks} />
			</div>
			<div class="flex flex-wrap gap-3">
				<a class="btn filled" href="/projects">See my projects<ArrowRight class="icon" aria-hidden="true" /></a>
				<a class="btn tonal" href={site.resumeUrl} target="_blank" rel="noopener"
					><FileText class="icon" aria-hidden="true" />Résumé</a
				>
				<a class="btn outlined" href="/contact">Say hello</a>
			</div>
			<span class="text-sm text-on-var">{site.location} · {site.school}</span>
		</div>

		<div
			aria-label="What I build"
			role="list"
			class="grid min-w-0 flex-[2_1_340px] grid-cols-2 place-items-center items-center gap-[18px] p-2"
		>
			<div
				role="listitem"
				class="float relative flex aspect-square w-[min(190px,100%)] flex-col items-center justify-center gap-1.5 text-on-pri-c"
				style="--r:-6deg"
			>
				<Blob shape="cookie" fill="var(--pri-c)" class="absolute inset-0 size-full" />
				<Globe class="icon relative" style="width:30px;height:30px" aria-hidden="true" />
				<span class="relative text-base font-[650]">Web apps</span>
			</div>
			<div
				role="listitem"
				class="float mt-10 flex aspect-[4/5] w-[min(160px,90%)] flex-col items-center justify-center gap-1.5 rounded-[999px_999px_28px_28px] bg-ter-c text-on-ter-c"
				style="--r:4deg;animation-delay:-2s"
			>
				<Monitor class="icon" style="width:30px;height:30px" aria-hidden="true" />
				<span class="text-center text-base font-[650]">Desktop tools</span>
			</div>
			<div
				role="listitem"
				class="float relative -mt-6 flex aspect-square w-[min(180px,100%)] flex-col items-center justify-center gap-1.5 text-on-rose-c"
				style="--r:0deg;animation-delay:-4s"
			>
				<Blob shape="flower" fill="var(--rose-c)" class="absolute inset-0 size-full" />
				<Box class="icon relative" style="width:30px;height:30px" aria-hidden="true" />
				<span class="relative text-center text-base font-[650]">Minecraft mods</span>
			</div>
			<div
				role="listitem"
				class="float flex h-[84px] w-[min(190px,100%)] items-center justify-center gap-2.5 rounded-[42px] bg-sand-c text-on-sand-c"
				style="--r:-10deg;animation-delay:-1s"
			>
				<Puzzle class="icon" style="width:26px;height:26px" aria-hidden="true" />
				<span class="text-base font-[650]">Libraries</span>
			</div>
		</div>
	</section>

	<section aria-labelledby="feat-h" class="flex flex-col gap-6">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<h2 id="feat-h" class="disp m-0 text-4xl">Featured projects</h2>
			<a class="btn outlined" href="/projects">All projects<ArrowRight class="icon" aria-hidden="true" /></a>
		</div>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(310px,100%),1fr))] gap-5">
			{#each featured as project (project.slug)}
				<article class="card hov flex flex-col gap-3.5 p-7">
					<ProjectTile project={project} mode="glyph" />
					<h3 class="disp m-0 text-[28px]">{project.title}</h3>
					<span class="-mt-2 text-sm font-semibold text-ter">{project.tagline}</span>
					<p class="m-0 text-on-var">{project.shortBlurb ?? project.blurb}</p>
					<div class="mt-auto flex flex-wrap gap-2">
						{#each project.featuredStack ?? project.stack.slice(0, 3) as s (s)}<span class="chip">{s}</span>{/each}
					</div>
					<div class="flex flex-wrap items-center gap-2 pt-1">
						<a class="btn tonal sm" href={getProjectHref(project)} aria-label="{project.title} details">Details</a>
						<a class="ib" href={project.repo} aria-label="{project.title} on GitHub" target="_blank" rel="noopener"
							><BrandIcon name="github" /></a
						>
						{#if project.download}
							<a class="ib" href={project.download.href} aria-label={project.download.label} target="_blank" rel="noopener"
								><Download class="icon" aria-hidden="true" /></a
							>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section aria-labelledby="snap-h" class="flex flex-col gap-6">
		<h2 id="snap-h" class="disp m-0 text-4xl">What I've been up to</h2>
		<div class="flex flex-wrap items-stretch gap-5">
			<RecentRepos />
			<div class="flex min-w-0 flex-[1_1_300px] flex-col gap-5">
				<a
					href={getProjectHref(focus)}
					class="card hov tinted relative flex flex-col gap-2 overflow-hidden bg-pri-c p-6 text-on-pri-c"
				>
					<Blob
						shape="sunny"
						fill="var(--surface)"
						class="absolute -right-12 -bottom-14 size-[190px] opacity-35"
					/>
					<span class="disp relative text-[30px]">{focus.title}</span>
					<span class="relative max-w-[30ch] text-[15px]">{currentFocus.text}</span>
				</a>
				<div class="card flex flex-1 flex-col gap-3.5 p-6">
					<h3 class="m-0 text-lg font-[650]">Tools I use the most</h3>
					<div class="flex flex-wrap gap-2">
						{#each mostUsedTools as t (t)}<span class="chip">{t}</span>{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section
		aria-labelledby="quick-h"
		class="card flex flex-wrap items-center justify-between gap-6 bg-ter-c p-8 text-on-ter-c"
	>
		<div class="flex flex-[1_1_280px] flex-col gap-1.5">
			<h2 id="quick-h" class="disp m-0 text-[30px]">Want to see more?</h2>
			<p class="m-0 text-base">You can look through all of my projects, check out my résumé, or send me a message.</p>
		</div>
		<div class="flex flex-wrap gap-2.5">
			<a class="btn plain" href="/projects">All projects</a>
			<a class="btn plain" href={site.github.url} target="_blank" rel="noopener">GitHub</a>
			<a class="btn plain" href={site.resumeUrl} target="_blank" rel="noopener">Résumé</a>
			<a class="btn bg-ter text-surface" href="/contact">Contact</a>
		</div>
	</section>

	<Footer extra=" · thanks for scrolling all the way down" />
</div>
