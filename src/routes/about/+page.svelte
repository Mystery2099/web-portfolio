<script lang="ts">
	import Code from '@lucide/svelte/icons/code';
	import Cpu from '@lucide/svelte/icons/cpu';
	import Database from '@lucide/svelte/icons/database';
	import Globe from '@lucide/svelte/icons/globe';
	import Server from '@lucide/svelte/icons/server';
	import Shield from '@lucide/svelte/icons/shield';
	import Terminal from '@lucide/svelte/icons/terminal';
	import Wrench from '@lucide/svelte/icons/wrench';
	import Blob from '#lib/components/Blob.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import Markdown from '#lib/components/Markdown.svelte';
	import { tones } from '#lib/components/tones.ts';
	import type { skillIcons } from '#lib/content/collections.ts';
	import { interests, intro, philosophy, portrait, skills } from '#content/about.md';

	const icons: Record<(typeof skillIcons)[number], typeof Code> = {
		code: Code,
		globe: Globe,
		database: Database,
		wrench: Wrench,
		shield: Shield,
		terminal: Terminal,
		server: Server,
		cpu: Cpu
	};

	// Colours and silhouettes cycle through these, so content/about.md only lists text.
	const skillLooks = [
		{ tone: 'teal', radius: '50%' },
		{ tone: 'lav', radius: '999px 999px 8px 8px' },
		{ tone: 'sand', radius: '12px' },
		{ tone: 'rose', radius: '50% 50% 50% 8px' }
	] as const;
	const stickerLooks = [
		{ tone: 'teal', radius: '999px', rotate: -3 },
		{ tone: 'lav', radius: '999px 999px 24px 24px', rotate: 2, padding: '30px 28px 22px' },
		{ tone: 'sand', radius: '28px', rotate: -1 },
		{ tone: 'rose', radius: '40px 40px 40px 8px', rotate: 3 },
		{ tone: 'neutral', radius: '999px', rotate: -2 },
		{ tone: 'teal', radius: '8px 40px 8px 40px', rotate: 1 }
	] as const;
</script>

<SeoHead title="About" description="About Mathew Kennedy-Brewer: skills, interests and how he approaches software." />

<div class="main-pad gap-[72px]">
	<section aria-labelledby="about-h" class="flex flex-wrap items-center gap-12">
		<div class="flex min-w-0 flex-[3_1_480px] flex-col gap-[18px]">
			<h1 id="about-h" class="disp m-0 text-[clamp(48px,6.5vw,84px)] leading-[0.98]">
				<span class="stretch">Hey,</span> <span class="stretch">I'm</span> <span class="stretch text-pri">Mathew.</span>
			</h1>
			<div class="md md-wavy flex max-w-[62ch] flex-col gap-3.5 text-lg leading-[1.6] text-on-var">
				<Markdown blocks={intro.blocks} />
			</div>
		</div>
		<div class="relative flex min-w-0 flex-[2_1_300px] justify-center py-6">
			<div class="absolute top-0 right-[8%] size-[120px] rounded-full bg-rose-c" aria-hidden="true"></div>
			<div class="absolute bottom-0 left-[6%] h-16 w-[140px] -rotate-12 rounded-[32px] bg-sand-c" aria-hidden="true"></div>
			<div
				class="mono relative flex aspect-[4/5] w-[min(300px,100%)] items-center justify-center overflow-hidden rounded-[999px_999px_40px_40px] bg-ter-c text-[13px] font-medium text-on-ter-c"
			>
				{#if portrait}
					<img src={portrait.src} alt={portrait.alt} class="size-full object-cover" />
				{:else}
					<span aria-hidden="true" class="disp text-[96px] opacity-80">M</span>
				{/if}
			</div>
		</div>
	</section>

	<section aria-labelledby="skills-h" class="flex flex-col gap-6">
		<h2 id="skills-h" class="disp m-0 text-4xl">Technical skills</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
			{#each skills as g, i (g.title)}
				{@const Icon = icons[g.icon]}
				{@const look = skillLooks[i % skillLooks.length]}
				<div class="card hov flex flex-col gap-3.5 p-6">
					<div class="flex items-center gap-3">
						<span
							class="dot"
							aria-hidden="true"
							style:border-radius={look.radius}
							style:background={tones[look.tone].fill}
							style:color={tones[look.tone].ink}><Icon class="icon" /></span
						>
						<h3 class="m-0 text-[19px] font-[650]">{g.title}</h3>
					</div>
					<div class="flex flex-wrap gap-2">{#each g.items as s (s)}<span class="chip">{s}</span>{/each}</div>
				</div>
			{/each}
		</div>
	</section>

	<section aria-labelledby="int-h" class="flex flex-col gap-6">
		<h2 id="int-h" class="disp m-0 text-4xl">Development interests</h2>
		<ul class="m-0 flex list-none flex-wrap items-center gap-4 px-0 py-3">
			{#each interests as label, i (label)}
				{@const look = stickerLooks[i % stickerLooks.length]}
				<li
					class="sticker"
					style:background={tones[look.tone].fill}
					style:color={tones[look.tone].ink}
					style:border-radius={look.radius}
					style:transform="rotate({look.rotate}deg)"
					style:padding={'padding' in look ? look.padding : undefined}
				>
					{label}
				</li>
			{/each}
		</ul>
	</section>

	<section
		aria-labelledby="phil-h"
		class="card relative overflow-hidden rounded-[40px] bg-pri-c px-10 py-12 text-on-pri-c"
	>
		<Blob shape="flower" fill="var(--surface)" class="absolute -top-[60px] -right-[60px] size-[280px] opacity-40" />
		<div class="relative flex max-w-[760px] flex-col gap-4">
			<h2 id="phil-h" class="disp md-stretch m-0 text-[clamp(32px,4vw,48px)] leading-[1.08]">
				{@html philosophy.titleHtml}
			</h2>
			<div class="md flex flex-col gap-3 text-lg"><Markdown blocks={philosophy.blocks} /></div>
		</div>
	</section>

	<Footer />
</div>
