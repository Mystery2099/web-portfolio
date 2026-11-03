<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { prefs } from '#lib/state/prefs.svelte.ts';
</script>

{#if prefs.resolvedTheme === 'dark'}
	<Sun class="icon" aria-hidden="true" />
{:else}
	<Moon class="icon" aria-hidden="true" />
{/if}
