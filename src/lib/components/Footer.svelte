<script lang="ts">
	import { site } from '#lib/data/site.ts';

	let { extra = '' }: { extra?: string } = $props();
</script>

<footer class="flex flex-wrap justify-between gap-3 text-[13px] text-on-var">
	<span>© {site.year} {site.name}</span>
	<span>Built with SvelteKit &amp; TypeScript{extra}</span>
</footer>
