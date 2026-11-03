import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { content } from './src/lib/content/plugin.ts';

export default defineConfig({
	// Bundle Kit's cookie dependency so prerendering uses its installed version,
	// rather than resolving an unrelated package outside this workspace.
	ssr: { noExternal: ['cookie'] },
	plugins: [
		content(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Fully static output. `fallback` serves client-rendered pages for any
			// route that wasn't prerendered, so the build works on any static host.
			adapter: adapter({ fallback: '404.html' }),
			prerender: { handleHttpError: 'fail' }
		})
	]
});
