<script lang="ts">
	import Blob from './Blob.svelte';
	import ProjectGlyph from './ProjectGlyph.svelte';
	import { tones } from './tones';
	import type { Project } from '#lib/data/projects.ts';

	/** `mode="glyph"` shows the project icon (home page); `"initials"` shows the monogram. */
	let { project, mode = 'initials' }: { project: Project; mode?: 'initials' | 'glyph' } = $props();
	const tone = $derived(tones[project.tone]);
</script>

<div class="tile" style:color={tone.ink} aria-hidden="true">
	{#if project.shape === 'arch'}
		<span class="bg" style="inset:6px 2px 0;width:auto;height:auto;border-radius:999px 999px 18px 18px" style:background={tone.fill}
		></span>
	{:else}
		<Blob class="bg" shape={project.shape} fill={tone.fill} />
	{/if}
	{#if mode === 'glyph'}
		<ProjectGlyph glyph={project.glyph} class="icon glyph" />
	{:else}
		<span class="ini">{project.initials}</span>
	{/if}
</div>
