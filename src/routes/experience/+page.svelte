<script lang="ts">
	import Briefcase from '@lucide/svelte/icons/briefcase';
	import Download from '@lucide/svelte/icons/download';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import Footer from '#lib/components/Footer.svelte';
	import Markdown from '#lib/components/Markdown.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { academic, certifications, competitions, education, intro, work } from '#content/experience.md';
	import { site } from '#lib/data/site.ts';

	const bullet = [
		{ color: 'var(--pri)', radius: '50%' },
		{ color: 'var(--ter)', radius: '3px' },
		{ color: 'var(--rose)', radius: '50%' },
		{ color: 'var(--pri)', radius: '3px' }
	];
	// Ongoing entries get the highlighted dot; past ones alternate shapes.
	const currentNode = 'border-radius:50%;background:var(--pri-c);border:6px solid var(--pri)';
	const pastNodes = ['border-radius:8px;background:var(--ter-c)', 'border-radius:999px 999px 6px 6px;background:var(--sand-c)'];
	const nodeStyle = (when: string, i: number) => (/present/i.test(when) ? currentNode : pastNodes[(i + 1) % pastNodes.length]);
</script>

<SeoHead title="Experience" description="Work, education, competitions and academic projects." />

<div class="main-pad gap-16 leading-[1.6]">
	<section class="flex flex-col gap-3">
		<h1 class="disp m-0 text-[clamp(48px,6vw,80px)] leading-none"><span class="stretch">Experience</span></h1>
		<div class="md md-wavy flex max-w-[60ch] flex-col gap-3 text-[19px] text-on-var">
			<Markdown blocks={intro.blocks} />
		</div>
	</section>

	<div class="flex flex-wrap items-start gap-6">
		<section aria-labelledby="work-h" class="card flex min-w-0 flex-[1_1_440px] flex-col gap-5 p-8">
			<h2 id="work-h" class="disp m-0 flex items-center gap-3 text-[28px]">
				<span aria-hidden="true" class="flex size-10 items-center justify-center rounded-full bg-pri-c text-on-pri-c"
					><Briefcase class="icon" /></span
				>Work
			</h2>
			{#each work as job (job.title)}
				<div class="flex flex-col gap-1.5">
					<h3 class="m-0 text-[22px] font-bold">{job.title}</h3>
					<span class="text-base text-on-var">{job.org}</span>
					<span class="when">{job.when}</span>
				</div>
				<ul class="m-0 flex list-none flex-col gap-2.5 p-0">
					{#each job.points as point, i (point)}
						{@const b = bullet[i % bullet.length]}
						<li class="flex gap-3">
							<span
								aria-hidden="true"
								class="mt-2 size-2.5 flex-none"
								style:border-radius={b.radius}
								style:background={b.color}
							></span><span>{@html point}</span>
						</li>
					{/each}
				</ul>
			{/each}
		</section>

		<section
			aria-labelledby="edu-h"
			class="card flex min-w-0 flex-[1_1_440px] flex-col gap-[22px] border border-outline-var bg-s-low p-8"
		>
			<h2 id="edu-h" class="disp m-0 flex items-center gap-3 text-[28px]">
				<span
					aria-hidden="true"
					class="flex size-10 items-center justify-center rounded-[999px_999px_10px_10px] bg-ter-c text-on-ter-c"
					><GraduationCap class="icon" /></span
				>Education
			</h2>
			<ol class="tl">
				{#each education as e, i (e.title)}
					<li>
						<div class="rail-col">
							<span class="node" aria-hidden="true" style={nodeStyle(e.when, i)}></span><span class="line"></span>
						</div>
						<div class="body">
							<h3 class="m-0 text-[19px] font-bold">{e.title}</h3>
							<span class="text-on-var">{e.org}</span>
							<span class="when">{e.when}</span>
							{#if e.note}<span class="md text-[15px] text-on-var">{@html e.note}</span>{/if}
						</div>
					</li>
				{/each}
			</ol>
		</section>
	</div>

	<section aria-labelledby="more-h" class="flex flex-col gap-5">
		<h2 id="more-h" class="disp m-0 text-[32px]">Outside the classroom</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
			{#each competitions as o (o.title)}
				<div class="card hov flex flex-col gap-2.5 p-[26px]">
					<h3 class="m-0 text-xl font-bold">{o.title}</h3>
					<p class="md m-0 text-on-var">{@html o.body}</p>
					<span class="when">{o.when}</span>
				</div>
			{/each}
			<div class="card hov flex flex-col gap-2.5 p-[26px]">
				<h3 class="m-0 text-xl font-bold">Certifications</h3>
				<div class="flex flex-wrap gap-2">{#each certifications as c (c)}<span class="chip">{c}</span>{/each}</div>
			</div>
		</div>
	</section>

	<section aria-labelledby="acad-h" class="flex flex-col gap-5">
		<h2 id="acad-h" class="disp m-0 text-[32px]">School projects</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4">
			{#each academic as a (a.title)}
				{#if a.project}
					<a class="card hov flex flex-col gap-2.5 p-[26px] text-on" href="/projects/{a.project}">
						<h3 class="disp m-0 text-2xl">{a.title}</h3>
						<span class="-mt-1.5 text-sm font-semibold text-ter">{a.course}</span>
						<p class="m-0 text-on-var">{@html a.body}</p>
					</a>
				{:else}
					<div class="card flex flex-col gap-2.5 bg-sand-c p-[26px] text-on-sand-c">
						<h3 class="disp m-0 text-2xl">{a.title}</h3>
						<span class="-mt-1.5 text-sm font-semibold">{a.course}</span>
						<p class="md m-0">{@html a.body}</p>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<section
		aria-labelledby="cv-h"
		class="card flex flex-wrap items-center gap-7 rounded-[40px] bg-pri-c p-9 text-on-pri-c"
	>
		<div
			aria-hidden="true"
			class="flex h-[150px] w-[120px] flex-none -rotate-4 flex-col gap-2 rounded-[16px_40px_16px_16px] bg-surface px-4 py-5"
		>
			<span class="h-2.5 w-[60%] rounded-[5px] bg-pri"></span>
			{#each [90, 80, 85, 50, 75] as w (w)}<span class="h-1.5 rounded-[3px] bg-outline-var" style:width="{w}%"
				></span>{/each}
		</div>
		<div class="flex flex-[1_1_280px] flex-col gap-1.5">
			<h2 id="cv-h" class="disp m-0 text-[32px]">My résumé</h2>
			<p class="m-0 text-[17px]">Everything on this page and a little more, all on one page.</p>
		</div>
		<div class="flex flex-wrap gap-2.5">
			<a class="btn filled" href={site.resumeUrl} target="_blank" rel="noopener">View résumé</a>
			{#if site.resumePdf}
				<a class="btn plain" href={site.resumePdf} download><Download class="icon" aria-hidden="true" />PDF</a>
			{/if}
			<a class="btn plain" href="/contact">Contact</a>
		</div>
	</section>

	<Footer />
</div>
