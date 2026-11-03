// Build-time only: lets the site `import` Markdown files under `content/`.
// Each file becomes a module of plain JSON exports (see collections.ts), so the
// Markdown parser and validators never reach the browser.
import { z } from 'zod';
import type { Plugin } from 'vite';
import { loadContent } from './collections.ts';

export function content(): Plugin {
	return {
		name: 'portfolio-content',
		enforce: 'pre',
		transform(source, id) {
			const [path, query = ''] = id.split('?');
			if (!path.endsWith('.md') || !path.includes('/content/')) return;
			// `?only=meta` keeps a single export, so lists can import card data
			// without pulling every page's body into the shared bundle.
			const only = new URLSearchParams(query).get('only');
			let exports: Record<string, unknown>;
			try {
				exports = loadContent(path, source);
			} catch (e) {
				const why = e instanceof z.ZodError ? z.prettifyError(e) : e instanceof Error ? e.message : String(e);
				this.error(`${path.slice(path.indexOf('/content/') + 1)}: ${why}`);
			}
			const code = Object.entries(exports)
				.filter(([name]) => !only || name === only)
				.map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
				.join('\n');
			return { code, map: null };
		}
	};
}
