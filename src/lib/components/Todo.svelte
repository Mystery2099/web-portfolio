<script lang="ts">
	import { dev } from '$app/env';
	import type { Snippet } from 'svelte';

	/**
	 * Marks content that still needs writing. Rendered only during `pnpm dev`,
	 * so unfinished sections never ship.
	 */
	let { children }: { children: Snippet } = $props();
</script>

{#if dev}
	<div class="ph rounded-[20px] border border-dashed border-outline-var px-5 py-4" data-todo>
		{@render children()}
	</div>
{/if}
