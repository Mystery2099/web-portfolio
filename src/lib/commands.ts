import { navItems } from '#lib/data/nav.ts';
import { projects, projectHref, techFilters } from '#lib/data/projects.ts';
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
	const pages: Command[] = navItems.map((n) => ({
		id: `page:${n.href}`,
		group: 'Pages',
		label: n.label,
		hint: n.href,
		keywords: n.keywords,
		href: n.href
	}));

	const projectCmds: Command[] = projects.map((p) => ({
		id: `project:${p.slug}`,
		group: 'Projects',
		label: p.title,
		hint: p.kind,
		keywords: [...p.stack, ...p.techs, p.catLabel, p.blurb].join(' '),
		href: projectHref(p)
	}));

	const techCmds: Command[] = techFilters.map((t) => {
		const count = projects.filter((p) => p.techs.includes(t)).length;
		return {
			id: `tech:${t}`,
			group: 'Technologies',
			label: `Projects built with ${t}`,
			hint: `${count} project${count === 1 ? '' : 's'}`,
			keywords: t,
			href: `/projects?tech=${encodeURIComponent(t)}`,
			searchOnly: true
		};
	});

	const dark = preferences.isDarkTheme;
	const actions: Command[] = [
		{
			id: 'act:theme',
			group: 'Actions',
			label: dark ? 'Switch to light theme' : 'Switch to dark theme',
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
			.filter((p) => !(preferences.navStyle === 'dock' && p === preferences.dockPosition))
			.map(
				(p): Command => ({
					id: `act:dock-${p}`,
					group: 'Actions',
					label: p === 'auto' ? 'Dock position: automatic' : `Move dock to ${dockNames[p]}`,
					hint: 'Dock',
					keywords: `dock position move side place ${p}`,
					run: () => {
						preferences.dockPosition = p;
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

	return [...pages, ...projectCmds, ...techCmds, ...actions];
}

/** Case-insensitive substring match over label, hint, keywords and group. */
export function matches(cmd: Command, query: string) {
	const q = query.trim().toLowerCase();
	if (!q) return !cmd.searchOnly;
	return `${cmd.label} ${cmd.hint} ${cmd.keywords} ${cmd.group}`.toLowerCase().includes(q);
}
