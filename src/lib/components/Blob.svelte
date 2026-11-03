<script lang="ts">
	import { shapePaths, type BlobShape } from './shapes';

	let {
		shape,
		fill,
		class: className = '',
		style = ''
	}: { shape: BlobShape; fill: string; class?: string; style?: string } = $props();
</script>

<svg viewBox="0 0 100 100" aria-hidden="true" class={className} {style}>
	<path style:fill={fill} d={shapePaths[shape]} />
</svg>
