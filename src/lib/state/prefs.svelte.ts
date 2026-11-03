import { PersistedState } from 'runed';
import { MediaQuery } from 'svelte/reactivity';

export type ThemePref = 'light' | 'dark' | 'system';
export type NavStyle = 'dock' | 'rail';
export type DockPos = 'auto' | 'top' | 'bottom' | 'left' | 'right';
export type ProjectView = 'cards' | 'list';

export const dockPositions: DockPos[] = ['auto', 'top', 'bottom', 'left', 'right'];

/**
 * Persist a string union as its raw value (not JSON) so the inline script in
 * `app.html` can read it before first paint. Unknown values fall back to the default.
 */
function persisted<T extends string>(key: string, initial: T, allowed: readonly T[]): PersistedState<T> {
	return new PersistedState<T>(key, initial, {
		serializer: {
			serialize: (value) => value,
			deserialize: (value) => (allowed.includes(value as T) ? (value as T) : initial)
		}
	});
}

class Preferences {
	#theme = persisted<ThemePref>('pf-theme', 'system', ['light', 'dark', 'system']);
	#nav = persisted<NavStyle>('pf-nav', 'dock', ['dock', 'rail']);
	#dock = persisted<DockPos>('pf-dock', 'auto', dockPositions);
	#view = persisted<ProjectView>('pf-view', 'cards', ['cards', 'list']);
	#systemDark = new MediaQuery('(prefers-color-scheme: dark)', false);
	#wide = new MediaQuery('(min-width: 1280px)', true);
	#tablet = new MediaQuery('(min-width: 600px)', true);

	get theme(): ThemePref {
		return this.#theme.current;
	}
	set theme(value: ThemePref) {
		this.#theme.current = value;
	}

	/** The theme actually on screen once "system" is resolved. */
	get resolvedTheme(): 'light' | 'dark' {
		const theme = this.#theme.current;
		if (theme === 'system') {
			return this.#systemDark.current ? 'dark' : 'light';
		}
		return theme;
	}

	toggleTheme(): void {
		this.theme = this.resolvedTheme === 'dark' ? 'light' : 'dark';
	}

	get nav(): NavStyle {
		return this.#nav.current;
	}
	set nav(value: NavStyle) {
		this.#nav.current = value;
	}

	get dock(): DockPos {
		return this.#dock.current;
	}
	/** Choosing a dock position also switches back to the dock. */
	set dock(value: DockPos) {
		this.#dock.current = value;
		this.#nav.current = 'dock';
	}

	/** The dock side actually used once "auto" is resolved against the viewport. */
	get resolvedDock(): Exclude<DockPos, 'auto'> {
		const dockPosition = this.#dock.current;
		if (dockPosition !== 'auto') {
			return dockPosition;
		}
		if (this.#wide.current) {
			return 'top';
		}
		return this.#tablet.current ? 'left' : 'bottom';
	}

	get projectView(): ProjectView {
		return this.#view.current;
	}
	set projectView(value: ProjectView) {
		this.#view.current = value;
	}
}

export const prefs = new Preferences();
