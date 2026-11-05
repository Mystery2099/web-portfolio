// Fixed vocabularies shared by the site and the content loader. Kept free of
// `import.meta.glob` so `vite.config.ts` can import it while validating content.
import type { BlobShape } from '#lib/components/shapes.ts';

export const toneNames = ['sand', 'teal', 'lav', 'rose'] as const;
export type Tone = (typeof toneNames)[number];

export const tileShapes = ['cookie', 'flower', 'sunny', 'clover', 'arch'] as const satisfies readonly (
	| BlobShape
	| 'arch'
)[];
export type TileShape = (typeof tileShapes)[number];

export const glyphs = ['armchair', 'dashboard', 'file', 'boxes', 'book', 'gem', 'download', 'ticket'] as const;
export type Glyph = (typeof glyphs)[number];

export const categories = [
	{ id: 'all', label: 'All' },
	{ id: 'web', label: 'Web Applications' },
	{ id: 'tools', label: 'Developer Tools' },
	{ id: 'mc', label: 'Minecraft & Modding' },
	{ id: 'other', label: 'Other Projects' }
] as const;
export type CategoryId = Exclude<(typeof categories)[number]['id'], 'all'>;
export const categoryIds = ['web', 'tools', 'mc', 'other'] as const satisfies readonly CategoryId[];

/** Technologies offered as "Built with" filters, in display order. */
export const techFilters = ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Svelte', 'PHP', 'Python'] as const;
export type Tech = (typeof techFilters)[number];
