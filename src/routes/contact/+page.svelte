<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Download from '@lucide/svelte/icons/download';
	import Mail from '@lucide/svelte/icons/mail';
	import Send from '@lucide/svelte/icons/send';
	import Blob from '#lib/components/Blob.svelte';
	import BrandIcon from '#lib/components/BrandIcon.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import Todo from '#lib/components/Todo.svelte';
	import { copyText } from '#lib/clipboard.ts';
	import { site } from '#lib/data/site.ts';

	let copied = $state<'idle' | 'ok' | 'fail'>('idle');
	let timer: ReturnType<typeof setTimeout>;

	async function copyEmail() {
		copied = (await copyText(site.email)) ? 'ok' : 'fail';
		clearTimeout(timer);
		timer = setTimeout(() => (copied = 'idle'), 2500);
	}

	const openTo = [
		{ label: 'Software development roles', cls: 'rounded-full bg-pri-c text-on-pri-c' },
		{ label: 'Internships & entry-level', cls: 'rounded-[22px_22px_8px_22px] bg-ter-c text-on-ter-c' },
		{ label: 'Open-source collaboration', cls: 'rounded-[999px_999px_12px_12px] bg-sand-c text-on-sand-c' },
		{ label: 'Interesting technical projects', cls: 'rounded-xl bg-rose-c text-on-rose-c' }
	];
</script>

<SeoHead title="Contact" description="Get in touch with Mathew Kennedy-Brewer about roles, internships, or open-source work." />

<div class="main-pad gap-14 leading-[1.6]">
	<section aria-labelledby="c-h" class="flex flex-wrap items-center gap-10">
		<div class="flex min-w-0 flex-[3_1_460px] flex-col gap-[18px]">
			<h1
				id="c-h"
				class="disp m-0 text-[clamp(52px,7vw,96px)] leading-[0.96]"
				style="font-variation-settings:'wdth' 108,'opsz' 96;font-weight:660;letter-spacing:0"
			>
				<span class="stretch">Let's</span> <span class="stretch text-pri">talk.</span>
			</h1>
			<p class="m-0 max-w-[54ch] text-[19px] text-on-var">
				If you're hiring, want to work on something together, or found a bug in one of my mods, feel free to reach out.
				Email is the best way to get in touch with me.
			</p>
			<ul aria-label="Open to" class="m-0 flex list-none flex-wrap gap-2.5 p-0">
				{#each openTo as o (o.label)}<li class="px-[18px] py-2.5 font-semibold {o.cls}">{o.label}</li>{/each}
			</ul>
		</div>
		<div aria-hidden="true" class="flex flex-[1_1_240px] justify-center">
			<div class="relative size-[220px]">
				<Blob shape="sunny" fill="var(--ter-c)" class="absolute inset-0 size-full animate-[spin_40s_linear_infinite]" />
				<div class="absolute inset-0 flex items-center justify-center text-on-ter-c">
					<Mail class="size-16" style="stroke-width:1.4" />
				</div>
			</div>
		</div>
	</section>

	<section aria-labelledby="ways-h" class="flex flex-col gap-5">
		<h2 id="ways-h" class="disp m-0 text-[32px]" style="font-variation-settings:'wdth' 108,'opsz' 96;font-weight:660;letter-spacing:0">
			Ways to reach me
		</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
			<div class="card col-span-full flex flex-col gap-3 bg-pri-c p-[26px] text-on-pri-c">
				<a
					href="mailto:{site.email}"
					class="text-[clamp(20px,2.6vw,30px)] font-medium tracking-[0.01em] wrap-anywhere text-on-pri-c">{site.email}</a
				>
				<div class="flex flex-wrap items-center gap-2.5">
					<a class="btn filled" href="mailto:{site.email}"><Send class="icon" aria-hidden="true" />Send an email</a>
					<button type="button" class="btn plain" onclick={copyEmail}>
						{#if copied === 'ok'}<Check class="icon" aria-hidden="true" />{:else}<Copy class="icon" aria-hidden="true" />{/if}
						<span aria-live="polite"
							>{copied === 'ok' ? 'Copied!' : copied === 'fail' ? 'Copy failed' : 'Copy address'}</span
						>
					</button>
				</div>
			</div>
			<a class="card hov flex items-center gap-4 p-6 text-on" href={site.github.url} target="_blank" rel="noopener">
				<span aria-hidden="true" class="flex size-12 flex-none items-center justify-center rounded-full bg-ter-c text-on-ter-c"
					><BrandIcon name="github" /></span
				>
				<span class="flex flex-col"
					><span class="font-[650]">GitHub</span><span class="mono text-[13px] text-on-var">@{site.github.user}</span></span
				>
			</a>
			{#if site.linkedin}
				<a class="card hov flex items-center gap-4 p-6 text-on" href={site.linkedin} target="_blank" rel="noopener">
					<span aria-hidden="true" class="flex size-12 flex-none items-center justify-center rounded-[14px] bg-sand-c text-on-sand-c"
						><BrandIcon name="linkedin" /></span
					>
					<span class="flex flex-col"
						><span class="font-[650]">LinkedIn</span><span class="mono text-[13px] text-on-var"
							>{site.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span
						></span
					>
				</a>
			{:else}
				<Todo>Add your LinkedIn URL in <code>src/lib/data/site.ts</code> to show a LinkedIn card here.</Todo>
			{/if}
			<a class="card hov flex items-center gap-4 p-6 text-on" href={site.resumeUrl} target="_blank" rel="noopener">
				<span
					aria-hidden="true"
					class="flex size-12 flex-none items-center justify-center rounded-[999px_999px_10px_10px] bg-rose-c text-on-rose-c"
					><Download class="icon" /></span
				>
				<span class="flex flex-col"
					><span class="font-[650]">Résumé</span><span class="mono text-[13px] text-on-var">View my résumé</span></span
				>
			</a>
		</div>
	</section>

	<Footer />
</div>
