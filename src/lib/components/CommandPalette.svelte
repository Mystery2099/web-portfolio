<script lang="ts">
	import { Command, Dialog } from 'bits-ui';
	import Search from '@lucide/svelte/icons/search';
	import { createHotkey } from '@tanstack/svelte-hotkeys';
	import { goto } from '$app/navigation';
	import { buildCommands, groupMark, groupOrder, matches, type Command as PaletteCommand } from '#lib/commands.ts';
	import { copyText } from '#lib/clipboard.ts';
	import { site } from '#lib/data/site.ts';
	import { uiState } from '#lib/state/ui.svelte.ts';

	let query = $state('');
	let selectedCommandId = $state('');
	/** Temporary hint overrides, e.g. "Copied!" after copying the email. */
	let hintOverrides = $state<Record<string, string>>({});
	let searchInput = $state<HTMLInputElement | null>(null);

	const commands = $derived(buildCommands(() => copyText(site.email)));
	const matchingCommands = $derived(commands.filter((command) => matches(command, query)));
	const groups = $derived(
		groupOrder
			.map((group) => ({ name: group, items: matchingCommands.filter((command) => command.group === group) }))
			.filter((group) => group.items.length)
	);

	// Highlight the first result whenever the results change.
	$effect(() => {
		selectedCommandId = matchingCommands[0]?.id ?? '';
	});

	$effect(() => {
		if (!uiState.isPaletteOpen) {
			query = '';
			hintOverrides = {};
		}
	});

	createHotkey('Mod+K', () => (uiState.isPaletteOpen ? (uiState.isPaletteOpen = false) : uiState.openPalette()));
	createHotkey('/', () => uiState.openPalette(), () => ({ enabled: !uiState.isPaletteOpen }));

	const isExternal = (href: string) => /^https?:/.test(href) || href.endsWith('.pdf');

	async function selectCommand(command: PaletteCommand) {
		if (command.href) {
			uiState.isPaletteOpen = false;
			if (isExternal(command.href)) window.open(command.href, '_blank', 'noopener');
			else await goto(command.href);
			return;
		}
		const hint = await command.run?.();
		if (typeof hint === 'string') hintOverrides = { ...hintOverrides, [command.id]: hint };
		else uiState.isPaletteOpen = false;
	}
</script>

<Dialog.Root bind:open={uiState.isPaletteOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="cmd-scrim" />
		<Dialog.Content
			class="cmd cmd-anim"
			aria-label="Command palette"
			onOpenAutoFocus={(event) => {
				event.preventDefault();
				searchInput?.focus();
			}}
		>
			<Dialog.Title class="sr">Command palette</Dialog.Title>
			<Command.Root shouldFilter={false} loop bind:value={selectedCommandId} label="Search pages, projects and actions">
				<div class="cmd-search">
					<Search class="icon" style="width:22px;height:22px" aria-hidden="true" />
					<Command.Input
						bind:ref={searchInput}
						bind:value={query}
						placeholder="Where to? Try “Kotlin” or “email”"
						autocomplete="off"
						spellcheck={false}
					/>
					<Dialog.Close class="kbd" aria-label="Close">Esc</Dialog.Close>
				</div>
				<Command.List class="cmd-list">
					<Command.Viewport>
						{#each groups as group (group.name)}
							<Command.Group value={group.name}>
								<Command.GroupHeading class="cmd-gl">{group.name}</Command.GroupHeading>
								<Command.GroupItems>
									{#each group.items as command (command.id)}
										{@const mark = groupMark[command.group]}
										<Command.Item class="cmd-opt" value={command.id} onSelect={() => selectCommand(command)}>
											<span class="ico" aria-hidden="true">
												<span style:background={mark.color} style:border-radius={mark.radius}></span>
											</span>
											{command.label}
											<span class="cmd-hint">{hintOverrides[command.id] ?? command.hint}</span>
										</Command.Item>
									{/each}
								</Command.GroupItems>
							</Command.Group>
						{/each}
						{#if !matchingCommands.length}
							<div class="cmd-empty" role="status">Nothing matches “{query}”. Try a page or project name.</div>
						{/if}
					</Command.Viewport>
				</Command.List>
			</Command.Root>
			<div class="cmd-foot" aria-hidden="true">
				<span><span class="kbd">↑</span> <span class="kbd">↓</span> move</span>
				<span><span class="kbd">Enter</span> open</span>
				<span><span class="kbd">Esc</span> close</span>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
