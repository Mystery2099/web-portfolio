import { navItems } from '#lib/data/nav.ts';
import { projectsWithPage } from '#lib/data/projects.ts';
import { site } from '#lib/data/site.ts';

export const prerender = true;

/** Every page on the site, so search engines can find project pages too. */
export function GET() {
	const paths = [...navItems.map((n) => n.href), ...projectsWithPage.map((p) => `/projects/${p.slug}`)];
	const urls = paths.map((path) => `\t<url><loc>${site.url}${path}</loc></url>`).join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
