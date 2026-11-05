import { navItems } from '#lib/data/nav.ts';
import { projects, getProjectHref, techFilters } from '#lib/data/projects.ts';
import { site } from '#lib/data/site.ts';
import { preferences, type DockPosition } from '#lib/state/preferences.svelte.ts';

export type CommandGroup = 'Pages' | 'Projects' | 'Technologies' | 'Actions';

export interface Command {
	id: string;
	group: CommandGroup;
	label: string;
	hint: string;
	/** Extra search terms; never shown. */
	keywords: string;
	/** Navigate here (internal path or external URL). */
	href?: string;
	/** …or run this. Return a hint to flash (e.g. "Copied!") and keep the palette open. */
	run?: () => void | string | Promise<void | string>;
	/** Technology entries only show up once the user types something. */
	searchOnly?: boolean;
}

export const groupOrder: CommandGroup[] = ['Pages', 'Projects', 'Technologies', 'Actions'];

/** Marker colour and silhouette per group, as in the design. */
export const groupMark: Record<CommandGroup, { color: string; radius: string }> = {
	Pages: { color: 'var(--pri)', radius: '50%' },
	Projects: { color: 'var(--ter)', radius: '50% 50% 4px 50%' },
	Technologies: { color: 'var(--ter)', radius: '4px 50%' },
	Actions: { color: 'var(--rose)', radius: '4px' }
};

const dockNames: Record<DockPosition, string> = {
	auto: 'automatic',
	top: 'the top',
	bottom: 'the bottom',
	left: 'the left',
	right: 'the right'
};

/**
 * Every palette entry. Reads `preferences`, so call it inside a reactive context to keep
 * labels like "Switch to light theme" current.
 */
export function buildCommands(copyEmail: () => Promise<boolean>): Command[] {
	const pages: Command[] = navItems.map((item) => ({
		id: `page:${item.href}`,
		group: 'Pages',
		label: item.label,
		hint: item.href,
		keywords: item.keywords,
		href: item.href
	}));

	const projectCommands: Command[] = projects.map((project) => ({
		id: `project:${project.slug}`,
		group: 'Projects',
		label: project.title,
		hint: project.kind,
		keywords: [...project.stack, ...project.techs, project.categoryLabel, project.blurb].join(' '),
		href: getProjectHref(project)
	}));

	const technologyCommands: Command[] = techFilters.map((technology) => {
		const count = projects.filter((project) => project.techs.includes(technology)).length;
		return {
			id: `tech:${technology}`,
			group: 'Technologies',
			label: `Projects built with ${technology}`,
			hint: `${count} project${count === 1 ? '' : 's'}`,
			keywords: technology,
			href: `/projects?tech=${encodeURIComponent(technology)}`,
			searchOnly: true
		};
	});

	const isDarkTheme = preferences.isDarkTheme;
	const actions: Command[] = [
		{
			id: 'act:theme',
			group: 'Actions',
			label: isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme',
			hint: 'Theme',
			keywords: 'dark light mode toggle appearance',
			run: () => preferences.toggleTheme()
		},
		...(preferences.theme !== 'system'
			? [
					{
						id: 'act:theme-system',
						group: 'Actions',
						label: 'Match system theme',
						hint: 'Theme',
						keywords: 'auto os device appearance dark light',
						run: () => {
							preferences.theme = 'system';
						}
					} satisfies Command
				]
			: []),
		{
			id: 'act:nav',
			group: 'Actions',
			label: preferences.navStyle === 'rail' ? 'Switch to floating dock' : 'Switch to classic navigation',
			hint: 'Layout',
			keywords: 'navbar sidebar rail dock navigation menu',
			run: () => {
				preferences.navStyle = preferences.navStyle === 'rail' ? 'dock' : 'rail';
			}
		},
		...(['auto', 'top', 'bottom', 'left', 'right'] as const)
			.filter((position) => !(preferences.navStyle === 'dock' && position === preferences.dockPosition))
			.map(
				(position): Command => ({
					id: `act:dock-${position}`,
					group: 'Actions',
					label: position === 'auto' ? 'Dock position: automatic' : `Move dock to ${dockNames[position]}`,
					hint: 'Dock',
					keywords: `dock position move side place ${position}`,
					run: () => {
						preferences.dockPosition = position;
					}
				})
			),
		{
			id: 'act:email',
			group: 'Actions',
			label: 'Copy email address',
			hint: site.email,
			keywords: 'contact mail',
			run: async () => ((await copyEmail()) ? 'Copied!' : 'Copy failed')
		},
		...(site.resumePdf
			? [
					{
						id: 'act:resume-pdf',
						group: 'Actions',
						label: 'Download résumé',
						hint: 'PDF',
						keywords: 'resume cv pdf download',
						href: site.resumePdf
					} satisfies Command
				]
			: []),
		{
			id: 'act:resume',
			group: 'Actions',
			label: 'Open résumé',
			hint: 'Web',
			keywords: 'resume cv',
			href: site.resumeUrl
		},
		{
			id: 'act:github',
			group: 'Actions',
			label: 'Open GitHub profile',
			hint: `@${site.github.user}`,
			keywords: 'code repos source',
			href: site.github.url
		}
	];

	return [...pages, ...projectCommands, ...technologyCommands, ...actions];
}

/** Case-insensitive substring match over label, hint, keywords and group. */
export function matches(command: Command, query: string) {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) return !command.searchOnly;
	return `${command.label} ${command.hint} ${command.keywords} ${command.group}`.toLowerCase().includes(normalizedQuery);
}
