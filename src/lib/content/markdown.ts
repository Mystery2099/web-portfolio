// Build-time only: turns a Markdown file into plain, serializable page data.
// Imported by the Vite plugin, never by the browser.
import type { BlockNode, InlineNode } from '@tanstack/markdown';
import { parseInline } from '@tanstack/markdown';
import { renderBlock, renderInline } from '@tanstack/markdown/html';
import { parseMarkdown } from '@tanstack/markdown/parser';
import { parse as parseYaml } from 'yaml';
import type { Block, Part, Section } from './types.ts';

const TODO = /^TODO:\s*/;

function text(nodes: InlineNode[]): string {
	return nodes
		.map((n) => ('value' in n ? n.value : 'children' in n ? text(n.children) : ''))
		.join('');
}

const inlineHtml = (nodes: InlineNode[]) => nodes.map((n) => renderInline(n)).join('');

/** Renders one line of inline Markdown (`*em*`, `**strong**`, links, `code`) to HTML. */
export const inlineMarkdown = (source: string) => inlineHtml(parseInline(source));

/** Converts one block. Paragraphs starting with "TODO:" become dev-only placeholders. */
function toBlock(node: BlockNode): Block {
	if (node.type === 'paragraph') {
		const plain = text(node.children);
		if (TODO.test(plain)) return { todo: plain.replace(TODO, '') };
	}
	if (node.type === 'list' && !node.ordered) {
		// Unordered lists keep their items separate so pages can style them (e.g. feature cards).
		return {
			list: node.items.map((item) =>
				item.children
					.map((child) => (child.type === 'paragraph' ? inlineHtml(child.children) : renderBlock(child)))
					.join('')
			)
		};
	}
	return { html: renderBlock(node) };
}


/**
 * Splits a document into sections at each `##` heading (keyed by its slug) and
 * each section into parts at `###` headings. Content before the first `##`
 * lands in the `intro` section.
 */
export function loadMarkdown(source: string) {
	const doc = parseMarkdown(source, { frontmatter: true });
	// A comment-only frontmatter block parses to null.
	const frontmatter: unknown = (doc.frontmatter ? parseYaml(doc.frontmatter) : null) ?? {};
	const sections: Record<string, Section> = {};
	let section: Section = (sections.intro = { title: '', blocks: [], parts: [] });
	let part: Part | undefined;

	for (const node of doc.children) {
		if (node.type === 'heading' && node.depth === 2) {
			const title = text(node.children);
			const key = node.id ?? title.toLowerCase();
			if (sections[key]) throw new Error(`Duplicate section "## ${title}"`);
			section = sections[key] = { title, blocks: [], parts: [] };
			part = undefined;
		} else if (node.type === 'heading' && node.depth === 3) {
			part = { title: text(node.children), titleHtml: inlineHtml(node.children), blocks: [] };
			section.parts.push(part);
		} else {
			(part ?? section).blocks.push(toBlock(node));
		}
	}
	return { frontmatter, sections };
}
