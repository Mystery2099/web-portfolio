<script lang="ts">
	import '../app.css';
	import { QueryClient } from '@tanstack/svelte-query';
	import { PersistQueryClientProvider } from '@tanstack/svelte-query-persist-client';
	import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
	import { formatForDisplay } from '@tanstack/svelte-hotkeys';
	import { browser } from '$app/env';
	import { onNavigate } from '$app/navigation';
	import CommandPalette from '#lib/components/CommandPalette.svelte';
	import Dock from '#lib/components/Dock.svelte';
	import Rail from '#lib/components/Rail.svelte';
	import { preferences } from '#lib/state/preferences.svelte.ts';
	import { uiState } from '#lib/state/ui.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 10 * 60 * 1000,
				gcTime: 24 * 60 * 60 * 1000,
				retry: 1,
				refetchOnWindowFocus: false
			}
		}
	});

	// GitHub allows 60 unauthenticated requests an hour, so cached responses
	// survive reloads (localStorage) and are only refetched once stale.
	const persister = browser ? createSyncStoragePersister({ storage: localStorage, key: 'pf-query-cache' }) : undefined;
	const persistOptions = { persister: persister!, maxAge: 24 * 60 * 60 * 1000, buster: 'v1' };

	// Platform-specific hint (⌘ K on macOS), resolved after hydration.
	let shortcut = $state('Ctrl K');
	$effect(() => {
		shortcut = formatForDisplay('Mod+K', { separatorToken: ' ' });
	});

	// Mirror preferences onto <html> (app.html sets them before first paint).
	$effect(() => {
		const d = document.documentElement.dataset;
		d.theme = preferences.resolvedTheme;
		d.nav = preferences.navStyle;
		d.dock = preferences.resolvedDockPosition;
	});

	onNavigate((navigation) => {
		uiState.isDockMenuOpen = false;
		if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<PersistQueryClientProvider client={queryClient} {persistOptions}>
	<a class="skip" href="#main">Skip to content</a>
	<div class="shell">
		<Rail />
		<Dock {shortcut} />
		<main id="main" tabindex="-1">
			{@render children()}
		</main>
	</div>
	<CommandPalette />
</PersistQueryClientProvider>
