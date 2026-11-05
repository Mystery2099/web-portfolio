/**
 * Build-time Markdown parsing: turns a Markdown file into plain, serializable
 * page data. Imported by the Vite plugin, never by the browser.
 */
import type { BlockNode, InlineNode } from '@tanstack/markdown';
import { parseInline } from '@tanstack/markdown';
import { renderBlock, renderInline } from '@tanstack/markdown/html';
import { parseMarkdown } from '@tanstack/markdown/parser';
import { parse as parseYaml } from 'yaml';
import type { Block, Part, Section } from './types.ts';

/** Paragraphs starting with this are treated as placeholders for unwritten content. */
const TODO_PREFIX_PATTERN = /^TODO:\s*/;

/** Returns the plain text of inline nodes, ignoring formatting. */
function getPlainText(nodes: InlineNode[]): string {
	return nodes
		.map((node) => ('value' in node ? node.value : 'children' in node ? getPlainText(node.children) : ''))
		.join('');
}

function renderInlineNodes(nodes: InlineNode[]): string {
	return nodes.map((node) => renderInline(node)).join('');
}

/**
 * Renders one line of inline Markdown (`*em*`, `**strong**`, links, `code`) to HTML.
 *
 * @param source Markdown without block-level syntax.
 */
export function inlineMarkdown(source: string): string {
	return renderInlineNodes(parseInline(source));
}

/**
 * Converts one block node. Paragraphs starting with "TODO:" become dev-only
 * placeholders, and unordered lists keep their items separate so pages can
 * style each one (e.g. as feature cards).
 */
function toBlock(node: BlockNode): Block {
	if (node.type === 'paragraph') {
		const plainText = getPlainText(node.children);
		if (TODO_PREFIX_PATTERN.test(plainText)) {
			return { todo: plainText.replace(TODO_PREFIX_PATTERN, '') };
		}
	}
	if (node.type === 'list' && !node.ordered) {
		return {
			list: node.items.map((item) =>
				item.children
					.map((child) => (child.type === 'paragraph' ? renderInlineNodes(child.children) : renderBlock(child)))
					.join('')
			)
		};
	}
	return { html: renderBlock(node) };
}

/**
 * Parses a Markdown document with YAML frontmatter.
 *
 * The body is split into sections at each `##` heading, keyed by the heading's
 * slug, and each section into parts at `###` headings. Content before the
 * first `##` lands in the `intro` section.
 *
 * @returns The unvalidated frontmatter (an empty object when there is none) and the sections.
 * @throws Error when two `##` headings share a slug.
 */
export function loadMarkdown(source: string): { frontmatter: unknown; sections: Record<string, Section> } {
	const document = parseMarkdown(source, { frontmatter: true });
	// A frontmatter block containing only comments parses to null.
	const frontmatter: unknown = (document.frontmatter ? parseYaml(document.frontmatter) : null) ?? {};
	const intro: Section = { title: '', blocks: [], parts: [] };
	const sections: Record<string, Section> = { intro };
	let currentSection = intro;
	let currentPart: Part | undefined;

	for (const node of document.children) {
		if (node.type === 'heading' && node.depth === 2) {
			const title = getPlainText(node.children);
			const key = node.id ?? title.toLowerCase();
			if (sections[key]) {
				throw new Error(`Duplicate section "## ${title}"`);
			}
			currentSection = sections[key] = { title, blocks: [], parts: [] };
			currentPart = undefined;
		} else if (node.type === 'heading' && node.depth === 3) {
			currentPart = { title: getPlainText(node.children), titleHtml: renderInlineNodes(node.children), blocks: [] };
			currentSection.parts.push(currentPart);
		} else {
			(currentPart ?? currentSection).blocks.push(toBlock(node));
		}
	}
	return { frontmatter, sections };
}
