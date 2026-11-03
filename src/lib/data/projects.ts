import type { ProjectMeta, ProjectPage } from '#lib/content/collections.ts';
import type { CategoryId } from './taxonomy.ts';

export * from './taxonomy.ts';

/**
 * Projects come from `content/projects/*.md`, one file per project. The file name
 * is the URL slug. See the README for the fields each file can have.
 */
export type Project = ProjectMeta;
export type { ProjectPage };

export const projects: Project[] = Object.values(
	import.meta.glob<ProjectMeta>('/content/projects/*.md', { eager: true, import: 'meta', query: { only: 'meta' } })
).sort((a, b) => a.order - b.order);

/** Case-study content, loaded only on that project's page. */
const pages = import.meta.glob<ProjectPage>('/content/projects/*.md', { import: 'page' });

export function loadProjectPage(slug: string) {
	return pages[`/content/projects/${slug}.md`]?.();
}

/** Small utilities grouped on one card instead of getting their own entries. */
export const littleMods = {
	title: 'Small Minecraft mods',
	blurb: "A few small mods that each fix or tweak one thing. They didn't really need their own pages.",
	items: ['Marble Mod', 'Stripped Logs Mod', 'Clear Spyglass Scope', 'No More Pumpkin Blur'],
	cat: 'mc' satisfies CategoryId,
	searchText: 'minecraft little mods utilities marble stripped logs clear spyglass scope no more pumpkin blur'
};

/** "What I'm working on" callout on the home page. */
export const currentFocus = {
	slug: 'wooden-accents',
	text: "What I'm spending most of my time on right now, with new blocks and fixes for Fabric and NeoForge."
};

export const toolsIReachFor = ['Kotlin', 'TypeScript', 'Svelte', 'Java', 'PHP', 'SQLite', 'Gradle', 'Linux'];

export const projectsWithPage = projects.filter((p) => p.hasPage);

export function getProject(slug: string) {
	return projects.find((p) => p.slug === slug);
}

/** Lower-cased text a project should match on: title, blurb, stack and category. */
export function projectSearchText(p: Project) {
	return [p.title, p.blurb, p.stack.join(' '), p.techs.join(' '), p.catLabel, p.kind].join(' ').toLowerCase();
}

/** Where a project card should link: its case study if it has one, otherwise its repository. */
export function projectHref(p: Project) {
	return p.hasPage ? `/projects/${p.slug}` : p.repo;
}
