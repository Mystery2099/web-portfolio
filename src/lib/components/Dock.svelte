<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import { page } from '$app/state';
	import { navItems, isActive } from '#lib/data/nav.ts';
	import { site } from '#lib/data/site.ts';
	import { prefs } from '#lib/state/prefs.svelte.ts';
	import { ui } from '#lib/state/ui.svelte.ts';
	import BrandIcon from './BrandIcon.svelte';
	import NavSettings from './NavSettings.svelte';
	import ThemeToggleIcon from './ThemeToggleIcon.svelte';

	let { shortcut }: { shortcut: string } = $props();
	let dock = $state<HTMLElement | null>(null);
</script>

<nav class="dock" aria-label="Primary" bind:this={dock}>
	<button
		class="dk"
		type="button"
		onclick={() => ui.openPalette()}
		aria-haspopup="dialog"
		aria-label="Search the site ({shortcut})"
	>
		<Search class="icon" aria-hidden="true" />
		<span class="lbl">Search<span class="kbd-mini">{shortcut}</span></span>
	</button>
	<span class="dk-sep" aria-hidden="true"></span>
	{#each navItems as item (item.href)}
		{@const on = isActive(item.href, page.url.pathname)}
		<a class="dk" class:on href={item.href} aria-current={on ? 'page' : undefined}>
			<item.icon class="icon" aria-hidden="true" />
			<span class="lbl">{item.label}</span>
		</a>
	{/each}
	<span class="dk-sep" aria-hidden="true"></span>
	<button
		class="dk dk-theme"
		type="button"
		onclick={() => prefs.toggleTheme()}
		aria-label={prefs.resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	>
		<ThemeToggleIcon />
	</button>
	<NavSettings anchor={dock} />
	<a class="dk dk-gh" href={site.github.url} aria-label="GitHub profile" target="_blank" rel="noopener">
		<BrandIcon name="github" />
	</a>
</nav>
