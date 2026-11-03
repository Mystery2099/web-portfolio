/** Copy text, falling back to a hidden textarea where the async Clipboard API is unavailable. */
export async function copyText(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.setAttribute('readonly', '');
		textArea.style.position = 'fixed';
		textArea.style.opacity = '0';
		document.body.append(textArea);
		textArea.select();
		const copied = document.execCommand('copy');
		textArea.remove();
		return copied;
	}
}
