import type { ProjectMeta, ProjectPage } from '#lib/content/collections.ts';
import type { CategoryId } from './taxonomy.ts';

export * from './taxonomy.ts';

/**
 * A project's card data. Projects come from `content/projects/*.md`, one file
 * per project, and the file name is the URL slug. See the README for the
 * fields each file can have.
 */
export type Project = ProjectMeta;
export type { ProjectPage };

/** Every project, in display order. */
export const projects: Project[] = Object.values(
	import.meta.glob<ProjectMeta>('/content/projects/*.md', { eager: true, import: 'meta', query: { only: 'meta' } })
).sort((first, second) => first.order - second.order);

/** Projects that have their own case-study page. */
export const projectsWithPage = projects.filter((project) => project.hasPage);

/** Case-study loaders, keyed by file path. Each page's content is only loaded on that page. */
const projectPageLoaders = import.meta.glob<ProjectPage>('/content/projects/*.md', { import: 'page' });

/** Small utilities grouped on one card instead of getting their own entries. */
export const smallMinecraftMods = {
	title: 'Small Minecraft mods',
	blurb: "A few small mods that each fix or tweak one thing. They didn't really need their own pages.",
	items: ['Marble Mod', 'Stripped Logs Mod', 'Clear Spyglass Scope', 'No More Pumpkin Blur'],
	category: 'mc' satisfies CategoryId,
	searchText: 'minecraft little mods utilities marble stripped logs clear spyglass scope no more pumpkin blur'
};

/** "What I'm working on" callout on the home page. */
export const currentFocus = {
	slug: 'wooden-accents',
	text: "What I'm spending most of my time on right now, with new blocks and fixes for Fabric and NeoForge."
};

/** Tools listed under "Tools I use the most" on the home page. */
export const mostUsedTools = ['Kotlin', 'TypeScript', 'Svelte', 'Java', 'PHP', 'SQLite', 'Gradle', 'Linux'];

/**
 * Finds a project by its slug.
 *
 * @returns The project, or `undefined` when no file has that name.
 */
export function findProject(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}

/**
 * Loads a project's case-study content.
 *
 * @returns The page content, or `undefined` when no file has that name.
 */
export function loadProjectPage(slug: string): Promise<ProjectPage> | undefined {
	return projectPageLoaders[`/content/projects/${slug}.md`]?.();
}

/**
 * Returns the project after the given one among those with a page, wrapping
 * around at the end. Used for the "Next up" link.
 */
export function getNextProjectWithPage(project: Project): Project {
	const index = projectsWithPage.indexOf(project);
	return projectsWithPage[(index + 1) % projectsWithPage.length];
}

/** Returns the lower-case text a project search should match: title, blurb, stack, and category. */
export function getProjectSearchText(project: Project): string {
	return [project.title, project.blurb, ...project.stack, ...project.techs, project.categoryLabel, project.kind]
		.join(' ')
		.toLowerCase();
}

/** Returns where a project card should link: its case study if it has one, otherwise its repository. */
export function getProjectHref(project: Project): string {
	return project.hasPage ? `/projects/${project.slug}` : project.repo;
}
