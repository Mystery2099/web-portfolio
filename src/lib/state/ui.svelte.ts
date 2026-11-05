/** Transient, app-wide UI state. Nothing here is persisted. */
class UiState {
	isPaletteOpen = $state(false);
	isDockMenuOpen = $state(false);

	/** Opens the command palette, closing the dock menu so they never overlap. */
	openPalette(): void {
		this.isDockMenuOpen = false;
		this.isPaletteOpen = true;
	}

	closePalette(): void {
		this.isPaletteOpen = false;
	}

	togglePalette(): void {
		if (this.isPaletteOpen) {
			this.closePalette();
		} else {
			this.openPalette();
		}
	}
}

/** The app-wide UI state instance. */
export const uiState = new UiState();
