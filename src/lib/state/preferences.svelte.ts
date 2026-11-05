import { PersistedState } from 'runed';
import { MediaQuery } from 'svelte/reactivity';

export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const;
export const NAV_STYLES = ['dock', 'rail'] as const;
export const DOCK_POSITIONS = ['auto', 'top', 'bottom', 'left', 'right'] as const;
export const PROJECT_VIEWS = ['cards', 'list'] as const;

/** The theme the visitor picked; `system` follows the operating system. */
export type ThemePreference = (typeof THEME_PREFERENCES)[number];
/** The floating dock, or the classic side rail. */
export type NavStyle = (typeof NAV_STYLES)[number];
/** Where the dock sits; `auto` picks a side from the viewport width. */
export type DockPosition = (typeof DOCK_POSITIONS)[number];
/** How the projects page lays out its results. */
export type ProjectView = (typeof PROJECT_VIEWS)[number];

/** A theme that is actually applied, after `system` has been resolved. */
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
/** A dock side that is actually used, after `auto` has been resolved. */
export type ResolvedDockPosition = Exclude<DockPosition, 'auto'>;

/**
 * Creates a `localStorage`-backed value restricted to a set of strings.
 *
 * The value is stored raw rather than as JSON so the inline script in
 * `app.html` can read it before first paint.
 *
 * @param key Storage key; must match the one read in `app.html`.
 * @param defaultValue Used when nothing is stored or the stored value is not allowed.
 * @param allowedValues Every value the setting may take.
 */
function createPersistedChoice<T extends string>(
	key: string,
	defaultValue: T,
	allowedValues: readonly T[]
): PersistedState<T> {
	return new PersistedState<T>(key, defaultValue, {
		serializer: {
			serialize: (value) => value,
			deserialize: (value) => (allowedValues.includes(value as T) ? (value as T) : defaultValue)
		}
	});
}

/** The visitor's saved display preferences, plus the values they resolve to. */
class Preferences {
	#theme = createPersistedChoice<ThemePreference>('pf-theme', 'system', THEME_PREFERENCES);
	#navStyle = createPersistedChoice<NavStyle>('pf-nav', 'dock', NAV_STYLES);
	#dockPosition = createPersistedChoice<DockPosition>('pf-dock', 'auto', DOCK_POSITIONS);
	#projectView = createPersistedChoice<ProjectView>('pf-view', 'cards', PROJECT_VIEWS);
	#prefersDarkScheme = new MediaQuery('(prefers-color-scheme: dark)', false);
	#isWideViewport = new MediaQuery('(min-width: 1280px)', true);
	#isTabletViewport = new MediaQuery('(min-width: 600px)', true);

	get theme(): ThemePreference {
		return this.#theme.current;
	}

	set theme(value: ThemePreference) {
		this.#theme.current = value;
	}

	/** The theme on screen once `system` is resolved. */
	get resolvedTheme(): ResolvedTheme {
		if (this.#theme.current !== 'system') {
			return this.#theme.current;
		}
		return this.#prefersDarkScheme.current ? 'dark' : 'light';
	}

	get isDarkTheme(): boolean {
		return this.resolvedTheme === 'dark';
	}

	/** Switches to the opposite of the theme currently on screen. */
	toggleTheme(): void {
		this.theme = this.isDarkTheme ? 'light' : 'dark';
	}

	get navStyle(): NavStyle {
		return this.#navStyle.current;
	}

	set navStyle(value: NavStyle) {
		this.#navStyle.current = value;
	}

	get dockPosition(): DockPosition {
		return this.#dockPosition.current;
	}

	/** Choosing a dock position also switches navigation back to the dock. */
	set dockPosition(value: DockPosition) {
		this.#dockPosition.current = value;
		this.#navStyle.current = 'dock';
	}

	/** The dock side used once `auto` is resolved against the viewport. */
	get resolvedDockPosition(): ResolvedDockPosition {
		if (this.#dockPosition.current !== 'auto') {
			return this.#dockPosition.current;
		}
		if (this.#isWideViewport.current) {
			return 'top';
		}
		return this.#isTabletViewport.current ? 'left' : 'bottom';
	}

	get projectView(): ProjectView {
		return this.#projectView.current;
	}

	set projectView(value: ProjectView) {
		this.#projectView.current = value;
	}
}

/** The app-wide preferences instance. */
export const preferences = new Preferences();
