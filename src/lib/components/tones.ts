import type { Tone } from '#lib/data/projects.ts';

/** Container fill + on-container ink for each accent tone. */
export const tones: Record<Tone | 'neutral', { fill: string; ink: string }> = {
	sand: { fill: 'var(--sand-c)', ink: 'var(--on-sand-c)' },
	teal: { fill: 'var(--pri-c)', ink: 'var(--on-pri-c)' },
	lav: { fill: 'var(--ter-c)', ink: 'var(--on-ter-c)' },
	rose: { fill: 'var(--rose-c)', ink: 'var(--on-rose-c)' },
	neutral: { fill: 'var(--s-high)', ink: 'var(--on)' }
};
