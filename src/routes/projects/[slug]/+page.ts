import { error } from '@sveltejs/kit';
import { getProject, loadProjectPage, projectsWithPage } from '#lib/data/projects.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => projectsWithPage.map((p) => ({ slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const project = getProject(params.slug);
	if (!project?.hasPage) error(404, 'Project not found');
	const detail = await loadProjectPage(project.slug);
	if (!detail) error(404, 'Project not found');
	const i = projectsWithPage.indexOf(project);
	const next = projectsWithPage[(i + 1) % projectsWithPage.length];
	return { project, detail, next };
};
