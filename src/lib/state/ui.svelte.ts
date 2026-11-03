/** Transient, app-wide UI state (not persisted). */
class UiState {
	paletteOpen = $state(false);
	dockMenuOpen = $state(false);

	openPalette(): void {
		this.dockMenuOpen = false;
		this.paletteOpen = true;
	}
}

export const ui = new UiState();
