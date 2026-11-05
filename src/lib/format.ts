/** Color and corner radius of a small marker dot, as CSS values. */
export interface Marker {
	color: string;
	radius: string;
}

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** Units tried from largest to smallest, with their length in seconds. */
const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 31_536_000],
	['month', 2_592_000],
	['week', 604_800],
	['day', 86_400],
	['hour', 3_600],
	['minute', 60]
];

/** Marker shown next to a repository, keyed by GitHub's language name. */
const LANGUAGE_MARKERS: Record<string, Marker> = {
	Kotlin: { color: 'var(--ter)', radius: '50%' },
	TypeScript: { color: 'var(--pri)', radius: '3px' },
	Svelte: { color: 'var(--rose)', radius: '50% 50% 3px 50%' },
	Java: { color: 'var(--rose)', radius: '3px 50%' },
	PHP: { color: 'var(--outline)', radius: '3px 50%' }
};

const DEFAULT_LANGUAGE_MARKER: Marker = { color: 'var(--outline)', radius: '50%' };

/**
 * Formats a timestamp relative to now, e.g. "3 days ago" or "last month".
 *
 * @param isoDate ISO 8601 timestamp.
 * @param now Reference time in milliseconds, for testing.
 */
export function formatTimeAgo(isoDate: string, now = Date.now()): string {
	const elapsedSeconds = (Date.parse(isoDate) - now) / 1000;
	for (const [unit, secondsPerUnit] of RELATIVE_TIME_UNITS) {
		if (Math.abs(elapsedSeconds) >= secondsPerUnit) {
			return RELATIVE_TIME_FORMATTER.format(Math.round(elapsedSeconds / secondsPerUnit), unit);
		}
	}
	return 'just now';
}

/**
 * Returns the marker dot for a programming language, matching the design's legend.
 *
 * @param language GitHub's language name, or `null` when unknown.
 */
export function getLanguageMarker(language: string | null): Marker {
	return language && Object.hasOwn(LANGUAGE_MARKERS, language)
		? LANGUAGE_MARKERS[language]
		: DEFAULT_LANGUAGE_MARKER;
}
