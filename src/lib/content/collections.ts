// Build-time only: what each kind of Markdown file may contain, and what it
// turns into. Mistakes in a file (a typo'd field, an unknown section) fail the
// build with the file name and the problem.
import { z } from 'zod';
import { categoryIds, glyphs, techFilters, tileShapes, toneNames } from '../data/taxonomy.ts';
import { inlineMarkdown, loadMarkdown } from './markdown.ts';
import { hasContent, type Section } from './types.ts';

const nameNote = z.strictObject({ name: z.string(), note: z.string() });
const image = z.strictObject({ src: z.string(), alt: z.string() });

const projectFrontmatter = z.strictObject({
	title: z.string(),
	/** Position in project lists; lower comes first. */
	order: z.number(),
	/** Two/three-letter monogram for the project tile. */
	ini: z.string().max(3),
	shape: z.enum(tileShapes),
	tone: z.enum(toneNames),
	glyph: z.enum(glyphs),
	category: z.enum(categoryIds),
	/** Label under the title on project cards, e.g. "Full-Stack Web Application". */
	categoryLabel: z.string(),
	/** Short label in the command palette, e.g. "Web app". */
	kind: z.string(),
	/** Subtitle on home-page cards, e.g. "Minecraft mod · Kotlin". */
	tagline: z.string(),
	primary: z.boolean().default(false),
	featured: z.boolean().default(false),
	blurb: z.string(),
	shortBlurb: z.string().optional(),
	stack: z.array(z.string()).min(1),
	featuredStack: z.array(z.string()).optional(),
	techs: z.array(z.enum(techFilters)).default([]),
	repo: z.url().startsWith('https://github.com/'),
	download: z.strictObject({ label: z.string(), href: z.url() }).optional(),
	note: z.string().optional(),
	status: z.string().optional(),
	facts: z.record(z.string(), z.string()).default({}),
	stackGroups: z.record(z.string(), z.array(z.string())).default({}),
	screenshots: z.array(image).default([]),
	screenshotHints: z.tuple([z.string(), z.string(), z.string()]).optional(),
	diagram: z
		.strictObject({ label: z.string(), top: nameNote, middle: z.array(nameNote).min(1), bottom: nameNote })
		.optional(),
	links: z
		.array(z.strictObject({ label: z.string(), href: z.url(), caption: z.string().optional() }))
		.default([])
});

const projectSections = ['intro', 'features', 'architecture', 'challenges', 'status'] as const;
type ProjectSectionKey = (typeof projectSections)[number];

const emptySection = (): Section => ({ title: '', blocks: [], parts: [] });

function checkSections<K extends string>(sections: Record<string, Section>, allowed: readonly K[]) {
	const unknown = Object.entries(sections).filter(([k]) => !allowed.includes(k as K));
	if (unknown.length) {
		const names = allowed.filter((k) => k !== 'intro').map((k) => `"## ${k[0].toUpperCase()}${k.slice(1)}"`);
		throw new Error(
			`Unknown section ${unknown.map(([, s]) => `"## ${s.title}"`).join(', ')}. ` +
				(names.length ? `Allowed: ${names.join(', ')}.` : 'This file has no sections.')
		);
	}
	return Object.fromEntries(allowed.map((k) => [k, sections[k] ?? emptySection()])) as Record<K, Section>;
}

function loadProject(source: string, file: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const f = projectFrontmatter.parse(frontmatter);
	const s = checkSections(sections, projectSections);
	const slug = file.slice(file.lastIndexOf('/') + 1, -'.md'.length);
	const githubRepo = new URL(f.repo).pathname.slice(1).replace(/\/$/, '');
	const host = (href: string) => {
		const u = new URL(href);
		return u.host === 'github.com' ? `github.com/${u.pathname.split('/')[1]}` : u.host;
	};
	// A project gets its own page once its overview (text before the first `##`) is written.
	const hasPage = hasContent({ blocks: s.intro.blocks });

	const meta = {
		slug,
		order: f.order,
		title: f.title,
		ini: f.ini,
		shape: f.shape,
		tone: f.tone,
		glyph: f.glyph,
		cat: f.category,
		catLabel: f.categoryLabel,
		kind: f.kind,
		tagline: f.tagline,
		primary: f.primary,
		featured: f.featured,
		blurb: f.blurb,
		shortBlurb: f.shortBlurb,
		stack: f.stack,
		featuredStack: f.featuredStack,
		techs: f.techs,
		repo: f.repo,
		githubRepo,
		download: f.download,
		note: f.note,
		hasPage
	};
	const page = {
		status: f.status,
		facts: Object.entries(f.facts).map(([label, value]) => ({ label, value })),
		stack: Object.entries(f.stackGroups).map(([label, items]) => ({ label, items })),
		screenshots: f.screenshots,
		screenshotHints: f.screenshotHints,
		diagram: f.diagram,
		links: [
			{ label: 'Repository', href: f.repo, caption: host(f.repo) },
			...f.links.map((l) => ({ ...l, caption: l.caption ?? host(l.href) }))
		],
		sections: s as Record<ProjectSectionKey, Section>
	};
	return { meta, page };
}

/** Icons available for skill groups on the About page. */
export const skillIcons = ['code', 'globe', 'database', 'wrench', 'shield', 'terminal', 'server', 'cpu'] as const;

const aboutFrontmatter = z.strictObject({
	portrait: image.optional(),
	skills: z.array(
		z.strictObject({ title: z.string(), icon: z.enum(skillIcons), items: z.array(z.string()).min(1) })
	),
	interests: z.array(z.string())
});

function loadAbout(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const { portrait, skills, interests } = aboutFrontmatter.parse(frontmatter);
	const s = checkSections(sections, ['intro', 'philosophy']);
	const [statement, ...extra] = s.philosophy.parts;
	if (!statement || extra.length) {
		throw new Error('"## Philosophy" needs exactly one "### " line: the big statement, with the paragraph under it.');
	}
	return { portrait, skills, interests, intro: s.intro, philosophy: statement };
}

// Strings in experience.md may use inline Markdown (*em*, **strong**, [links](…)).
const md = z.string().transform(inlineMarkdown);

const experienceFrontmatter = z.strictObject({
	work: z.array(z.strictObject({ title: z.string(), org: z.string(), when: z.string(), points: z.array(md) })),
	education: z.array(
		z.strictObject({ title: z.string(), org: z.string(), when: z.string(), note: md.optional() })
	),
	competitions: z.array(z.strictObject({ title: z.string(), body: md, when: z.string() })),
	certifications: z.array(z.string()),
	academic: z.array(
		z.strictObject({
			title: z.string(),
			course: z.string(),
			body: md,
			/** Links the card to /projects/<project>. */
			project: z.string().optional()
		})
	)
});

function loadExperience(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const f = experienceFrontmatter.parse(frontmatter);
	return { ...f, intro: checkSections(sections, ['intro']).intro };
}

function loadIntroOnly(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	z.strictObject({}).parse(frontmatter);
	return { intro: checkSections(sections, ['intro']).intro };
}

export type ProjectMeta = ReturnType<typeof loadProject>['meta'];
export type ProjectPage = ReturnType<typeof loadProject>['page'];
export type AboutContent = ReturnType<typeof loadAbout>;
export type IntroContent = ReturnType<typeof loadIntroOnly>;
export type ExperienceContent = ReturnType<typeof loadExperience>;

/** Which loader handles a file, by its path under `content/`. */
export function loadContent(path: string, source: string): Record<string, unknown> {
	if (/\/content\/projects\/[^/]+\.md$/.test(path)) return loadProject(source, path);
	if (path.endsWith('/content/about.md')) return loadAbout(source);
	if (path.endsWith('/content/home.md')) return loadIntroOnly(source);
	if (path.endsWith('/content/experience.md')) return loadExperience(source);
	throw new Error('No content loader for this file. Add one in src/lib/content/collections.ts.');
}
