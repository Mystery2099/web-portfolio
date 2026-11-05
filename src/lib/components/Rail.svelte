<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import PanelBottom from '@lucide/svelte/icons/panel-bottom';
	import { page } from '$app/state';
	import { navItems, isActive } from '#lib/data/nav.ts';
	import { site } from '#lib/data/site.ts';
	import { preferences } from '#lib/state/preferences.svelte.ts';
	import { uiState } from '#lib/state/ui.svelte.ts';
	import Blob from './Blob.svelte';
	import BrandIcon from './BrandIcon.svelte';
	import ThemeToggleIcon from './ThemeToggleIcon.svelte';
</script>

<aside class="rail" aria-label="Site">
	<a class="badge" href="/" aria-label="{site.name}, home">
		<Blob shape="cookie" fill="var(--pri-c)" />
		<span aria-hidden="true">{site.firstName[0]}</span>
	</a>
	<nav aria-label="Primary" class="rail-nav">
		{#each navItems as item (item.href)}
			{@const on = isActive(item.href, page.url.pathname)}
			<a class="ri" class:on href={item.href} aria-current={on ? 'page' : undefined}>
				<span class="ind"><item.icon class="icon" aria-hidden="true" /></span>
				<span class="lbl">{item.label}</span>
			</a>
		{/each}
	</nav>
	<div class="rail-foot">
		<button
			class="ib"
			type="button"
			onclick={() => preferences.toggleTheme()}
			aria-label={preferences.isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
		>
			<ThemeToggleIcon />
		</button>
		<button class="ib rail-search" type="button" onclick={() => uiState.openPalette()} aria-haspopup="dialog" aria-label="Search the site">
			<Search class="icon" aria-hidden="true" />
		</button>
		<button
			class="ib"
			type="button"
			onclick={() => (preferences.navStyle = 'dock')}
			aria-label="Switch to floating dock"
			title="Switch to floating dock"
		>
			<PanelBottom class="icon" aria-hidden="true" />
		</button>
		<a class="ib" href={site.github.url} aria-label="GitHub profile" target="_blank" rel="noopener">
			<BrandIcon name="github" />
		</a>
	</div>
</aside>
