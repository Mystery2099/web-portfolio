import { error } from '@sveltejs/kit';
import { findProject, getNextProjectWithPage, loadProjectPage, projectsWithPage } from '#lib/data/projects.ts';
import type { EntryGenerator, PageLoad } from './$types';

/** Prerenders one page per project that has a case study. */
export const entries: EntryGenerator = () => projectsWithPage.map((project) => ({ slug: project.slug }));

/**
 * Loads a project's card data, its case-study content, and the project to link to next.
 *
 * @throws 404 when the slug is unknown or the project has no case study.
 */
export const load: PageLoad = async ({ params }) => {
	const project = findProject(params.slug);
	const page = project?.hasPage ? await loadProjectPage(project.slug) : undefined;
	if (!project || !page) {
		error(404, 'Project not found');
	}
	return { project, page, nextProject: getNextProjectWithPage(project) };
};
