<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import type { Block } from '#lib/content/types.ts';
	import Todo from './Todo.svelte';

	/**
	 * Renders blocks from a `content/*.md` file. The HTML was produced at build
	 * time from your own Markdown, so it's trusted.
	 * `lists="features"` turns bullet lists into the check-mark cards used on project pages.
	 */
	let { blocks, lists = 'plain' }: { blocks: Block[]; lists?: 'plain' | 'features' } = $props();
</script>

{#each blocks as block, blockIndex (blockIndex)}
	{#if 'todo' in block}
		<Todo>{block.todo}</Todo>
	{:else if 'list' in block && lists === 'features'}
		<ul class="m-0 flex list-none flex-col gap-2.5 p-0">
			{#each block.list as item, itemIndex (itemIndex)}
				<li class="card flex items-center gap-3.5 rounded-[20px] px-5 py-3.5">
					<span
						aria-hidden="true"
						class="flex size-8 flex-none items-center justify-center rounded-full bg-pri-c text-on-pri-c"
						><Check class="size-[18px]" /></span
					><span>{@html item}</span>
				</li>
			{/each}
		</ul>
	{:else if 'list' in block}
		<ul class="m-0 flex flex-col gap-1.5 pl-5">
			{#each block.list as item, itemIndex (itemIndex)}<li>{@html item}</li>{/each}
		</ul>
	{:else}
		{@html block.html}
	{/if}
{/each}
