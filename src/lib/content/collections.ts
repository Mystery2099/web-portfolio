/**
 * Build-time content schemas: what each kind of Markdown file under `content/`
 * may contain, and the data it turns into. A mistake in a file, such as a
 * misspelled field or an unknown section, fails the build with the file name
 * and the problem.
 */
import { z } from 'zod';
import { categoryIds, glyphs, techFilters, tileShapes, toneNames } from '../data/taxonomy.ts';
import { inlineMarkdown, loadMarkdown } from './markdown.ts';
import { hasContent, type Section } from './types.ts';

/** Icons available for skill groups on the About page. */
export const skillIcons = ['code', 'globe', 'database', 'wrench', 'shield', 'terminal', 'server', 'cpu'] as const;

const PROJECT_SECTION_KEYS = ['intro', 'features', 'architecture', 'challenges', 'status'] as const;

const nameWithNoteSchema = z.strictObject({ name: z.string(), note: z.string() });
const imageSchema = z.strictObject({ src: z.string(), alt: z.string() });

/** A string of inline Markdown (`*em*`, `**strong**`, links), converted to HTML. */
const inlineMarkdownSchema = z.string().transform(inlineMarkdown);

const projectFrontmatterSchema = z.strictObject({
	title: z.string(),
	/** Position in project lists; lower comes first. */
	order: z.number(),
	/** Two- or three-letter monogram for the project tile. */
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
	screenshots: z.array(imageSchema).default([]),
	screenshotHints: z.tuple([z.string(), z.string(), z.string()]).optional(),
	diagram: z
		.strictObject({
			label: z.string(),
			top: nameWithNoteSchema,
			middle: z.array(nameWithNoteSchema).min(1),
			bottom: nameWithNoteSchema
		})
		.optional(),
	links: z
		.array(z.strictObject({ label: z.string(), href: z.url(), caption: z.string().optional() }))
		.default([])
});

const aboutFrontmatterSchema = z.strictObject({
	portrait: imageSchema.optional(),
	skills: z.array(
		z.strictObject({ title: z.string(), icon: z.enum(skillIcons), items: z.array(z.string()).min(1) })
	),
	interests: z.array(z.string())
});

const experienceFrontmatterSchema = z.strictObject({
	work: z.array(
		z.strictObject({ title: z.string(), org: z.string(), when: z.string(), points: z.array(inlineMarkdownSchema) })
	),
	education: z.array(
		z.strictObject({ title: z.string(), org: z.string(), when: z.string(), note: inlineMarkdownSchema.optional() })
	),
	competitions: z.array(z.strictObject({ title: z.string(), body: inlineMarkdownSchema, when: z.string() })),
	certifications: z.array(z.string()),
	academic: z.array(
		z.strictObject({
			title: z.string(),
			course: z.string(),
			body: inlineMarkdownSchema,
			/** Slug of a project; links the card to `/projects/<project>`. */
			project: z.string().optional()
		})
	)
});

function createEmptySection(): Section {
	return { title: '', blocks: [], parts: [] };
}

/**
 * Checks that a document only uses the allowed `##` sections and fills in
 * any that are missing with empty ones.
 *
 * @param sections Sections parsed from the document, keyed by heading slug.
 * @param allowedKeys Section keys this kind of file may contain.
 * @throws Error naming the unknown sections and listing the allowed ones.
 */
function requireKnownSections<K extends string>(
	sections: Record<string, Section>,
	allowedKeys: readonly K[]
): Record<K, Section> {
	const unknownSections = Object.entries(sections).filter(([key]) => !allowedKeys.includes(key as K));
	if (unknownSections.length > 0) {
		const unknownHeadings = unknownSections.map(([, section]) => `"## ${section.title}"`).join(', ');
		const allowedHeadings = allowedKeys
			.filter((key) => key !== 'intro')
			.map((key) => `"## ${key[0].toUpperCase()}${key.slice(1)}"`);
		const hint = allowedHeadings.length ? `Allowed: ${allowedHeadings.join(', ')}.` : 'This file has no sections.';
		throw new Error(`Unknown section ${unknownHeadings}. ${hint}`);
	}
	return Object.fromEntries(allowedKeys.map((key) => [key, sections[key] ?? createEmptySection()])) as Record<
		K,
		Section
	>;
}

/** Returns the file name without its directory or `.md` extension. */
function getSlugFromPath(filePath: string): string {
	return filePath.slice(filePath.lastIndexOf('/') + 1, -'.md'.length);
}

/** Returns `owner/name` for a GitHub repository URL. */
function getGitHubFullName(repositoryUrl: string): string {
	return new URL(repositoryUrl).pathname.slice(1).replace(/\/$/, '');
}

/** Returns a short caption for a link: `github.com/<owner>` for GitHub, otherwise the host. */
function getLinkCaption(href: string): string {
	const url = new URL(href);
	return url.host === 'github.com' ? `github.com/${url.pathname.split('/')[1]}` : url.host;
}

/**
 * Loads a project file.
 *
 * @returns `meta`, the card data every project list needs, and `page`, the
 *     case-study content that only the project's own page loads.
 */
function loadProject(source: string, filePath: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const project = projectFrontmatterSchema.parse(frontmatter);
	const projectSections = requireKnownSections(sections, PROJECT_SECTION_KEYS);

	const meta = {
		slug: getSlugFromPath(filePath),
		order: project.order,
		title: project.title,
		initials: project.ini,
		shape: project.shape,
		tone: project.tone,
		glyph: project.glyph,
		category: project.category,
		categoryLabel: project.categoryLabel,
		kind: project.kind,
		tagline: project.tagline,
		isPrimary: project.primary,
		isFeatured: project.featured,
		blurb: project.blurb,
		shortBlurb: project.shortBlurb,
		stack: project.stack,
		featuredStack: project.featuredStack,
		techs: project.techs,
		repo: project.repo,
		githubFullName: getGitHubFullName(project.repo),
		download: project.download,
		note: project.note,
		/** A project gets its own page once its overview (the text before the first `##`) is written. */
		hasPage: hasContent({ blocks: projectSections.intro.blocks })
	};
	const page = {
		status: project.status,
		facts: Object.entries(project.facts).map(([label, value]) => ({ label, value })),
		stack: Object.entries(project.stackGroups).map(([label, items]) => ({ label, items })),
		screenshots: project.screenshots,
		screenshotHints: project.screenshotHints,
		diagram: project.diagram,
		links: [
			{ label: 'Repository', href: project.repo, caption: getLinkCaption(project.repo) },
			...project.links.map((link) => ({ ...link, caption: link.caption ?? getLinkCaption(link.href) }))
		],
		sections: projectSections
	};
	return { meta, page };
}

/** Loads `content/about.md`. */
function loadAbout(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const { portrait, skills, interests } = aboutFrontmatterSchema.parse(frontmatter);
	const aboutSections = requireKnownSections(sections, ['intro', 'philosophy']);
	const [philosophyStatement, ...extraParts] = aboutSections.philosophy.parts;
	if (!philosophyStatement || extraParts.length > 0) {
		throw new Error('"## Philosophy" needs exactly one "### " line: the big statement, with the paragraph under it.');
	}
	return { portrait, skills, interests, intro: aboutSections.intro, philosophy: philosophyStatement };
}

/** Loads `content/experience.md`. */
function loadExperience(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	const experience = experienceFrontmatterSchema.parse(frontmatter);
	return { ...experience, intro: requireKnownSections(sections, ['intro']).intro };
}

/** Loads a file that has only an introduction and no frontmatter, such as `content/home.md`. */
function loadIntroOnly(source: string) {
	const { frontmatter, sections } = loadMarkdown(source);
	z.strictObject({}).parse(frontmatter);
	return { intro: requireKnownSections(sections, ['intro']).intro };
}

export type ProjectMeta = ReturnType<typeof loadProject>['meta'];
export type ProjectPage = ReturnType<typeof loadProject>['page'];
export type AboutContent = ReturnType<typeof loadAbout>;
export type IntroContent = ReturnType<typeof loadIntroOnly>;
export type ExperienceContent = ReturnType<typeof loadExperience>;

/**
 * Loads a content file with the loader that matches its path.
 *
 * @param filePath Absolute path of a file under `content/`.
 * @param source The file's Markdown.
 * @returns The module's named exports.
 * @throws Error when no loader handles the path, or the file is invalid.
 */
export function loadContent(filePath: string, source: string): Record<string, unknown> {
	if (/\/content\/projects\/[^/]+\.md$/.test(filePath)) return loadProject(source, filePath);
	if (filePath.endsWith('/content/about.md')) return loadAbout(source);
	if (filePath.endsWith('/content/home.md')) return loadIntroOnly(source);
	if (filePath.endsWith('/content/experience.md')) return loadExperience(source);
	throw new Error('No content loader for this file. Add one in src/lib/content/collections.ts.');
}
