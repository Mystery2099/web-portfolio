/** A rendered chunk of Markdown. */
export type Block =
	/** Trusted HTML rendered at build time from your own Markdown. */
	| { html: string }
	/** An unordered list, one inline-HTML string per item. */
	| { list: string[] }
	/** A paragraph starting with "TODO:". Shown as a placeholder in dev, hidden in production. */
	| { todo: string };

/** A `###` sub-heading and what follows it. */
export interface Part {
	title: string;
	/** The heading with its inline formatting, as HTML. */
	titleHtml: string;
	blocks: Block[];
}

/** A `##` heading and what follows it. */
export interface Section {
	title: string;
	blocks: Block[];
	parts: Part[];
}

/** True when a section or part has real content, not just TODOs. */
export function hasContent(x: { blocks: Block[]; parts?: Part[] } | undefined): boolean {
	if (!x) return false;
	return x.blocks.some((b) => !('todo' in b)) || (x.parts ?? []).some((p) => hasContent(p));
}
