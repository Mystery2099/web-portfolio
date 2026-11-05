<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import {
		createSortedRowModel,
		createTable,
		rowSortingFeature,
		sortFn_text,
		tableFeatures,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import { getProjectHref, type Project } from '#lib/data/projects.ts';
	import { tones } from './tones.ts';

	let { projects }: { projects: Project[] } = $props();

	const features = tableFeatures({
		rowSortingFeature,
		sortedRowModel: createSortedRowModel(),
		sortFns: { text: sortFn_text }
	});

	const columns: ColumnDef<typeof features, Project>[] = [
		{ id: 'title', accessorKey: 'title', header: 'Project', sortFn: 'text' },
		{ id: 'category', accessorKey: 'categoryLabel', header: 'Category', sortFn: 'text' },
		{ id: 'stack', header: 'Stack', enableSorting: false },
		{ id: 'links', header: 'Links', enableSorting: false }
	];

	const table = createTable({
		features,
		columns,
		get data() {
			return projects;
		}
	});

	const ariaSort = (sortDirection: false | 'asc' | 'desc') =>
		sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined;
</script>

<div class="card overflow-x-auto px-1 py-2">
	<table class="tbl">
		<caption class="sr">Projects</caption>
		<thead>
			{#each table.getHeaderGroups() as group (group.id)}
				<tr>
					{#each group.headers as header (header.id)}
						{@const sortDirection = header.column.getIsSorted()}
						<th scope="col" aria-sort={ariaSort(sortDirection)}>
							{#if header.column.id === 'links'}
								<span class="sr">Links</span>
							{:else if header.column.getCanSort()}
								<button type="button" onclick={header.column.getToggleSortingHandler()}>
									{header.column.columnDef.header}
									{#if sortDirection === 'asc'}<ArrowUp class="size-3.5" aria-hidden="true" />
									{:else if sortDirection === 'desc'}<ArrowDown class="size-3.5" aria-hidden="true" />
									{:else}<ChevronsUpDown class="size-3.5 opacity-60" aria-hidden="true" />{/if}
								</button>
							{:else}
								{header.column.columnDef.header}
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each table.getRowModel().rows as row (row.id)}
				{@const project = row.original}
				<tr>
					<td>
						<span class="flex items-center gap-3">
							<span
								aria-hidden="true"
								class="size-3.5 flex-none"
								style:border-radius={project.shape === 'arch' ? '999px 999px 3px 3px' : '50%'}
								style:background={tones[project.tone].fill}
							></span>
							<span class="flex flex-col">
								{#if project.hasPage}
									<a class="font-[650] text-on" href={getProjectHref(project)}>{project.title}</a>
								{:else}
									<span class="font-[650]">{project.title}</span>
								{/if}
								<span class="text-[13px] text-on-var">{project.isPrimary ? 'Primary project' : 'Smaller project'}</span>
							</span>
						</span>
					</td>
					<td><span class="text-sm font-semibold text-ter">{project.categoryLabel}</span></td>
					<td>
						<span class="flex flex-wrap gap-1.5">
							{#each project.stack as technology (technology)}<span class="chip">{technology}</span>{/each}
						</span>
					</td>
					<td class="text-right">
						<a class="ib ml-auto" href={project.repo} aria-label="{project.title} on GitHub" target="_blank" rel="noopener"
							><ArrowUpRight class="icon" aria-hidden="true" /></a
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
