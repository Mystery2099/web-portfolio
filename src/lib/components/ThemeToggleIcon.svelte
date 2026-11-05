<script lang="ts">
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { preferences } from '#lib/state/preferences.svelte.ts';
</script>

{#if preferences.isDarkTheme}
	<Sun class="icon" aria-hidden="true" />
{:else}
	<Moon class="icon" aria-hidden="true" />
{/if}
