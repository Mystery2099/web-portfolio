/**
 * Build-time Vite plugin that lets the site `import` Markdown files under
 * `content/`. Each file becomes a module of plain JSON exports (see
 * `collections.ts`), so the Markdown parser and validators never reach the browser.
 */
import { z } from 'zod';
import type { Plugin } from 'vite';
import { loadContent } from './collections.ts';

const CONTENT_DIRECTORY = '/content/';

/** Formats a loader failure as a readable build error. */
function describeError(error: unknown): string {
	if (error instanceof z.ZodError) return z.prettifyError(error);
	if (error instanceof Error) return error.message;
	return String(error);
}

/**
 * Creates the content plugin.
 *
 * Importing with `?only=<name>` keeps a single export, so project lists can
 * import card data without pulling every page's body into the shared bundle.
 */
export function content(): Plugin {
	return {
		name: 'portfolio-content',
		enforce: 'pre',
		transform(source, moduleId) {
			const [filePath, query = ''] = moduleId.split('?');
			if (!filePath.endsWith('.md') || !filePath.includes(CONTENT_DIRECTORY)) return;

			const onlyExport = new URLSearchParams(query).get('only');
			let moduleExports: Record<string, unknown>;
			try {
				moduleExports = loadContent(filePath, source);
			} catch (error) {
				const relativePath = filePath.slice(filePath.indexOf(CONTENT_DIRECTORY) + 1);
				this.error(`${relativePath}: ${describeError(error)}`);
			}
			const code = Object.entries(moduleExports)
				.filter(([name]) => !onlyExport || name === onlyExport)
				.map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};`)
				.join('\n');
			return { code, map: null };
		}
	};
}
