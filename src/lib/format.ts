const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
	['year', 31_536_000],
	['month', 2_592_000],
	['week', 604_800],
	['day', 86_400],
	['hour', 3_600],
	['minute', 60]
];

/** "3 days ago", "last month"… */
export function timeAgo(isoDate: string, now = Date.now()): string {
	const seconds = (Date.parse(isoDate) - now) / 1000;
	for (const [unit, secondsPerUnit] of RELATIVE_TIME_UNITS) {
		if (Math.abs(seconds) >= secondsPerUnit) {
			return relativeTimeFormatter.format(Math.round(seconds / secondsPerUnit), unit);
		}
	}
	return 'just now';
}

/** Dot colour and silhouette for a language, matching the design's legend. */
export function languageMark(language: string | null): { color: string; radius: string } {
	switch (language) {
		case 'Kotlin':
			return { color: 'var(--ter)', radius: '50%' };
		case 'TypeScript':
			return { color: 'var(--pri)', radius: '3px' };
		case 'Svelte':
			return { color: 'var(--rose)', radius: '50% 50% 3px 50%' };
		case 'Java':
			return { color: 'var(--rose)', radius: '3px 50%' };
		case 'PHP':
			return { color: 'var(--outline)', radius: '3px 50%' };
		default:
			return { color: 'var(--outline)', radius: '50%' };
	}
}
