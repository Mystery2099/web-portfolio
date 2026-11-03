<script lang="ts">
	import { Popover, RadioGroup } from 'bits-ui';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import SquareDot from '@lucide/svelte/icons/square-dot';
	import PanelTop from '@lucide/svelte/icons/panel-top';
	import PanelBottom from '@lucide/svelte/icons/panel-bottom';
	import PanelLeft from '@lucide/svelte/icons/panel-left';
	import PanelRight from '@lucide/svelte/icons/panel-right';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import SunMoon from '@lucide/svelte/icons/sun-moon';
	import { prefs, type DockPos, type ThemePref } from '#lib/state/prefs.svelte.ts';
	import { ui } from '#lib/state/ui.svelte.ts';

	/** The dock element, so the menu lines up with the dock's edge rather than the button. */
	let { anchor }: { anchor: HTMLElement | null } = $props();

	const positions = [
		{ value: 'auto', label: 'Auto', icon: SquareDot },
		{ value: 'top', label: 'Top', icon: PanelTop },
		{ value: 'bottom', label: 'Bottom', icon: PanelBottom },
		{ value: 'left', label: 'Left', icon: PanelLeft },
		{ value: 'right', label: 'Right', icon: PanelRight }
	] as const;
	const themes = [
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'system', label: 'System', icon: SunMoon }
	] as const;

	const side = $derived(
		({ top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const)[prefs.resolvedDock]
	);
</script>

<Popover.Root bind:open={ui.dockMenuOpen}>
	<Popover.Trigger class="dk" aria-label="Navigation settings" title="Navigation settings">
		<SlidersHorizontal class="icon" aria-hidden="true" />
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="dock-menu"
			customAnchor={anchor}
			{side}
			align="end"
			sideOffset={10}
			collisionPadding={12}
			aria-label="Navigation settings"
		>
			<div class="dm-h" id="dm-pos">Dock position</div>
			<RadioGroup.Root
				class="dm-row"
				aria-labelledby="dm-pos"
				orientation="horizontal"
				bind:value={() => prefs.dock, (v) => (prefs.dock = v as DockPos)}
			>
				{#each positions as p (p.value)}
					<RadioGroup.Item class="dm-opt" value={p.value}>
						<p.icon class="icon" aria-hidden="true" />{p.label}
					</RadioGroup.Item>
				{/each}
			</RadioGroup.Root>
			<div class="dm-h" id="dm-theme">Theme</div>
			<RadioGroup.Root
				class="dm-row three"
				aria-labelledby="dm-theme"
				orientation="horizontal"
				bind:value={() => prefs.theme, (v) => (prefs.theme = v as ThemePref)}
			>
				{#each themes as t (t.value)}
					<RadioGroup.Item class="dm-opt" value={t.value}>
						<t.icon class="icon" aria-hidden="true" />{t.label}
					</RadioGroup.Item>
				{/each}
			</RadioGroup.Root>
			<button
				type="button"
				class="dm-wide"
				onclick={() => {
					ui.dockMenuOpen = false;
					prefs.nav = 'rail';
				}}
			>
				<PanelLeft class="icon" aria-hidden="true" />Use the classic side bar
			</button>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
