<script lang="ts">
	import { Command, Dialog } from 'bits-ui';
	import Search from '@lucide/svelte/icons/search';
	import { createHotkey } from '@tanstack/svelte-hotkeys';
	import { goto } from '$app/navigation';
	import { buildCommands, groupMark, groupOrder, matches, type Command as Cmd } from '#lib/commands.ts';
	import { copyText } from '#lib/clipboard.ts';
	import { site } from '#lib/data/site.ts';
	import { uiState } from '#lib/state/ui.svelte.ts';

	let query = $state('');
	let selected = $state('');
	/** Temporary hint overrides, e.g. "Copied!" after copying the email. */
	let flashed = $state<Record<string, string>>({});
	let input = $state<HTMLInputElement | null>(null);

	const commands = $derived(buildCommands(() => copyText(site.email)));
	const hits = $derived(commands.filter((c) => matches(c, query)));
	const groups = $derived(
		groupOrder.map((g) => ({ name: g, items: hits.filter((c) => c.group === g) })).filter((g) => g.items.length)
	);

	// Like the design: highlight the first result whenever the results change.
	$effect(() => {
		selected = hits[0]?.id ?? '';
	});

	$effect(() => {
		if (!uiState.isPaletteOpen) {
			query = '';
			flashed = {};
		}
	});

	createHotkey('Mod+K', () => (uiState.isPaletteOpen ? (uiState.isPaletteOpen = false) : uiState.openPalette()));
	createHotkey('/', () => uiState.openPalette(), () => ({ enabled: !uiState.isPaletteOpen }));

	const isExternal = (href: string) => /^https?:/.test(href) || href.endsWith('.pdf');

	async function select(cmd: Cmd) {
		if (cmd.href) {
			uiState.isPaletteOpen = false;
			if (isExternal(cmd.href)) window.open(cmd.href, '_blank', 'noopener');
			else await goto(cmd.href);
			return;
		}
		const hint = await cmd.run?.();
		if (typeof hint === 'string') flashed = { ...flashed, [cmd.id]: hint };
		else uiState.isPaletteOpen = false;
	}
</script>

<Dialog.Root bind:open={uiState.isPaletteOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="cmd-scrim" />
		<Dialog.Content
			class="cmd cmd-anim"
			aria-label="Command palette"
			onOpenAutoFocus={(e) => {
				e.preventDefault();
				input?.focus();
			}}
		>
			<Dialog.Title class="sr">Command palette</Dialog.Title>
			<Command.Root shouldFilter={false} loop bind:value={selected} label="Search pages, projects and actions">
				<div class="cmd-search">
					<Search class="icon" style="width:22px;height:22px" aria-hidden="true" />
					<Command.Input
						bind:ref={input}
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
									{#each group.items as cmd (cmd.id)}
										{@const mark = groupMark[cmd.group]}
										<Command.Item class="cmd-opt" value={cmd.id} onSelect={() => select(cmd)}>
											<span class="ico" aria-hidden="true">
												<span style:background={mark.color} style:border-radius={mark.radius}></span>
											</span>
											{cmd.label}
											<span class="cmd-hint">{flashed[cmd.id] ?? cmd.hint}</span>
										</Command.Item>
									{/each}
								</Command.GroupItems>
							</Command.Group>
						{/each}
						{#if !hits.length}
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
