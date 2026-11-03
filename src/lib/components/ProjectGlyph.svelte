<script lang="ts">
	import Armchair from '@lucide/svelte/icons/armchair';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import FileText from '@lucide/svelte/icons/file-text';
	import Boxes from '@lucide/svelte/icons/boxes';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Gem from '@lucide/svelte/icons/gem';
	import Download from '@lucide/svelte/icons/download';
	import type { Project } from '#lib/data/projects.ts';

	let { glyph, class: className = 'icon', style = '' }: { glyph: Project['glyph']; class?: string; style?: string } =
		$props();

	const icons = {
		armchair: Armchair,
		dashboard: LayoutDashboard,
		file: FileText,
		boxes: Boxes,
		book: BookOpen,
		gem: Gem,
		download: Download
	};
	const Icon = $derived(icons[glyph]);
</script>

<Icon class={className} {style} aria-hidden="true" />
